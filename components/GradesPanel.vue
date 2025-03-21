<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 overflow-y-auto">
      <div class="space-y-6 p-5 sm:p-6 pb-36 sm:pb-8">
        <h2 class="text-xl font-bold mb-4" :class="titlePadding">Notes</h2>

        <!-- Standalone Grades -->
        <div class="space-y-2">
          <div v-for="grade in standaloneGrades" :key="grade.id" class="mb-2">
            <Input :placeholder="grade.name" v-model.number="grade.value" @input="updateGrade(grade.id, grade.value)"
              type="number" min="0" max="20" step="0.1" />
          </div>
        </div>

        <!-- Group Grades -->
        <Collapsible v-for="group in groupRules" :key="group.id" :defaultOpen="true"
          class="border rounded-md p-4 space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex-1 group relative flex items-center">
              <h3 v-if="!isEditing[group.id]" class="font-semibold flex items-center">
                {{ group.name }}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  class="opacity-0 group-hover:opacity-100 ml-2 inline-flex h-6 w-6"
                  @click="startEditing(group.id, true)">
                  <SquarePen class="h-2 w-2" />
                </Button>
              </h3>
              <div v-else class="flex-1">
                <Input
                  ref="editInput"
                  v-model="editingName"
                  @blur="stopEditing(group.id)"
                  @keyup.enter="stopEditing(group.id)"
                  @keyup.esc="cancelEditing"
                />
              </div>
            </div>
            <div class="flex gap-2">
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="icon">
                  <ChevronsUpDown class="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
              <Button variant="destructive" size="icon">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 class="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer le groupe</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer ce groupe ? Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction @click="removeGroup(group.id)">Supprimer</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </Button>
            </div>
          </div>

          <CollapsibleContent>
            <!-- Teaching Units -->
            <div class="space-y-4">
              <Collapsible v-for="unit in getGroupGrades(group.id)?.teachingUnits" :key="unit.id"
                class="border rounded-md p-4 space-y-4 bg-gray-50" :defaultOpen="unit.id.endsWith('-standalone')">
                <div class="flex items-center justify-between gap-2">
                  <div class="flex-1 group relative flex items-center gap-2">
                    <h4 v-if="!isEditing[unit.id]" class="font-medium text-l py-1 px-2 rounded flex align-center">
                      {{ unit.name }}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        class="opacity-0 group-hover:opacity-100 ml-2 inline-flex h-6 w-6"
                        @click="startEditing(unit.id)">
                        <SquarePen class="h-2 w-2" />
                      </Button>
                    </h4>
                    <div v-else class="flex-1">
                      <Input ref="editInput" v-model="editingName" @blur="stopEditing(group.id, unit.id)"
                        @keyup.enter="stopEditing(group.id, unit.id)" @keyup.esc="cancelEditing" />
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" size="icon">
                        <ChevronsUpDown class="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                    <Button variant="destructive" size="icon">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon">
                            <Trash2 class="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer l'UE</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer cette unité d'enseignement ? Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction @click="removeTeachingUnit(group.id, unit.id)">Supprimer</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </Button>
                  </div>
                </div>

                <CollapsibleContent>
                  <!-- Subjects -->
                  <div class="space-y-4">
                    <div v-for="(subject, index) in unit.subjects" :key="subject.id" 
                         :class="{'border-b pb-4': index !== unit.subjects.length - 1}"
                         class="space-y-2">
                      <div class="flex gap-2">
                        <div class="flex-1">
                          <Label class="text-sm">Matière</Label>
                          <Input v-model="subject.name" placeholder="Nom de la matière" />
                        </div>
                        <div class="flex items-end">
                          <Button variant="destructive" size="icon">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon">
                                  <Trash2 class="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Supprimer la matière</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer cette matière ? Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction @click="removeSubject(group.id, unit.id, subject.id)">Supprimer</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </Button>
                        </div>
                      </div>
                      <div class="flex gap-2">
                        <div class="flex-1">
                          <Label class="text-sm">Note</Label>
                          <Input v-model="subject.value" @input="onSubjectValueInput(subject)" type="number" min="0" max="20" step="0.1" />
                        </div>
                        <div class="flex-1">
                          <Label class="text-sm">Coef.</Label>
                          <Input v-model.number="subject.coefficient" type="number" min="0" step="0.5" />
                        </div>
                      </div>
                    </div>
                    <Button @click="addSubject(group.id, unit.id)" variant="outline" class="w-full">
                      <FileText /> Ajouter une matière
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              <div class="flex flex-col sm:flex-row gap-2">
                <Button @click="addTeachingUnit(group.id)" class="w-full">
                  <Plus /> Ajouter une UE
                </Button>
                <Button @click="addStandaloneSubject(group.id)" variant="outline" class="w-full">
                  <FileText /> Ajouter une matière
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <!-- Actions -->
        <div class="flex gap-2">
          <Button @click="addGroup" class="w-full">
            <FolderPlus /> Ajouter un Groupe
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" class="w-full">
                <RefreshCw /> Réinitialiser
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Réinitialiser les données</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir réinitialiser toutes vos données ? Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction @click="resetData">Réinitialiser</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trash2, Plus, ChevronsUpDown, SquarePen, FolderPlus, FileText, RefreshCw } from 'lucide-vue-next'
import { useSidebar } from '@/components/ui/sidebar/utils'

const store = useValidationStore()

const groupRules = computed(() =>
  store.rules.filter(rule => rule.type === 'Group Average') as GroupRuleType[]
)

const standaloneGrades = computed(() =>
  store.grades.filter(grade => !grade.groupId)
)

const isEditing = ref<Record<string, boolean>>({})
const editingName = ref('')
const editInput = ref<HTMLInputElement | null>(null)

const { open: isOpen } = useSidebar()
const titlePadding = computed(() => !isOpen.value ? 'pl-10' : '')

function getGroupGrades(groupId: string) {
  const grade = store.grades.find(grade => grade.groupId === groupId)
  if (!grade?.teachingUnits) {
    // Initialize teachingUnits if undefined
    store.updateGrade(groupId, null, undefined, [])
  }
  return grade
}

function updateGrade(id: string, value: number, coefficient?: number) {
  store.updateGrade(id, value, coefficient)
}

function addTeachingUnit(groupId: string) {
  const group = getGroupGrades(groupId)
  const unitNumber = (group?.teachingUnits?.length || 0) + 1
  const unitName = `UE ${unitNumber}`
  store.addTeachingUnit(groupId, unitName)
}

function addSubject(groupId: string, unitId: string) {
  const subject: Subject = {
    id: Date.now().toString(),
    name: 'Nouvelle matière',
    value: null,
    coefficient: 1
  }
  store.addSubject(groupId, unitId, subject)
}

function removeTeachingUnit(groupId: string, unitId: string) {
  store.removeTeachingUnit(groupId, unitId)
}

function removeSubject(groupId: string, unitId: string, subjectId: string) {
  store.removeSubject(groupId, unitId, subjectId)
}

function addGradeToGroup(groupId: string) {
  store.addGrade({
    id: Date.now().toString(),
    name: `Note ${store.grades.length + 1}`,
    value: null,
    coefficient: 1,
    groupId
  })
}

function removeGradeFromGroup(groupId: string, gradeId: string) {
  store.removeGrade(gradeId)
}

function updateUnitName(groupId: string, unitId: string, name: string) {
  store.updateTeachingUnit(groupId, unitId, { name })
}

function startEditing(id: string, isGroup = false) {
  if (isGroup) {
    const group = groupRules.value.find(g => g.id === id)
    if (group) {
      editingName.value = group.name
      isEditing.value[id] = true
      nextTick(() => {
        editInput.value?.focus()
      })
    }
  } else {
    const unit = findUnit(id)
    if (unit) {
      editingName.value = unit.name
      isEditing.value[id] = true
      nextTick(() => {
        editInput.value?.focus()
      })
    }
  }
}

function stopEditing(id: string, unitId?: string) {
  if (editingName.value.trim()) {
    if (unitId) {
      updateUnitName(id, unitId, editingName.value)
    } else {
      // Update group name
      const group = groupRules.value.find(g => g.id === id)
      if (group) {
        group.name = editingName.value
        store.updateRule(group)
        // Update corresponding grade entry
        const grade = store.grades.find(g => g.id === id)
        if (grade) {
          grade.name = editingName.value
        }
      }
    }
  }
  isEditing.value[id] = false
}

function cancelEditing() {
  Object.keys(isEditing.value).forEach(key => {
    isEditing.value[key] = false
  })
}

function findUnit(unitId: string) {
  for (const group of groupRules.value) {
    const grade = getGroupGrades(group.id)
    const unit = grade?.teachingUnits?.find(u => u.id === unitId)
    if (unit) return unit
  }
  return null
}

function addGroup() {
  const groupId = Date.now().toString()
  const newRule: GroupRuleType = {
    id: groupId,
    type: "Group Average",
    name: "Nouveau Groupe",
    rules: [{
      type: "Minimum Average",
      value: 10
    }],
    units: [],
  }
  store.addRule(newRule)

  store.addGrade({
    id: groupId,
    name: "Nouveau Groupe",
    value: null,
    groupId,
    teachingUnits: []
  })
}

function removeGroup(id: string) {
  store.removeRule(id)
  store.removeGrade(id)
}

function addStandaloneSubject(groupId: string) {
  store.addStandaloneSubject(groupId)
}

function onSubjectValueInput(subject: Subject) {
  if (subject.value === '') {
    subject.value = null
  } else {
    subject.value = parseFloat(subject.value)
    if (isNaN(subject.value)) {
      subject.value = null
    }
  }
}

function resetData() {
  // Clear current data
  store.clearAllData()
  
  // Show the welcome drawer again to let user choose between template or blank start
  store.setFirstVisitState(true)
}
</script>
