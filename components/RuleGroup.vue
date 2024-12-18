<template>
  <Collapsible class="border rounded-md p-4 space-y-4 bg-white">
    <div class="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
      <div class="w-full">
        <Label class="mb-1 inline-flex gap-1 items-center">
          <Folder size="1rem" />
          Nom du Groupe
        </Label>
        <Input v-model="rule.name" @change="emitUpdate" />
      </div>
      <div class="w-full flex justify-end space-x-2">
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="icon">
            <ChevronsUpDown class="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <Button variant="destructive" @click="$emit('remove', rule.id)" size="icon">
          <Trash2 class="h-4 w-4" />
        </Button>
      </div>
    </div>

    <CollapsibleContent>
      <!-- Group Rules -->
      <div class="mt-4 space-y-4">
        <div class="space-y-2">
          <Label>Règles du Groupe</Label>
          <div v-for="(groupRule, index) in rule.rules" :key="index"
            class="flex flex-col gap-2 p-4 border rounded-md bg-gray-100">
            <div class="flex items-end gap-2">
              <div class="flex-1">
                <Label class="mb-1 inline-flex items-center">
                  <Sigma size="1rem" class="mr-1" />
                  Règle
                </Label>
                <Select v-model="groupRule.type" @change="emitUpdate">
                  <SelectTrigger>
                    <SelectValue>{{ groupRule.type }}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Minimum Average">Moyenne Minimale</SelectItem>
                    <SelectItem value="Minimum Validated">Minimum d'UE Validées</SelectItem>
                    <SelectItem value="Maximum Failures">Maximum d'Échecs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="w-24">
                <Label class="mb-1 inline-flex items-center">
                  <Hash size="1rem" class="mr-1" />
                  Valeur
                </Label>
                <Input v-model.number="groupRule.value" type="number" min="0" step="0.1" @change="emitUpdate" class="w-16" />
              </div>
            </div>
            <Button variant="destructive" size="icon" @click="removeGroupRule(index)" class="self-end">
              <Trash2 class="h-4 w-4" />
            </Button>
          </div>

          <Button @click="addGroupRule" variant="outline" class="w-full">
            <Plus class="mr-2 h-4 w-4" /> Ajouter une règle
          </Button>
        </div>
      </div>
    </CollapsibleContent>
  </Collapsible>
</template>

<script setup lang="ts">
import { Plus, ChevronsUpDown, Trash2, Hash, Sigma, Folder } from 'lucide-vue-next'
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from '@/components/ui/collapsible'

const props = defineProps({
  rule: {
    type: Object as PropType<GroupRuleType>,
    required: true,
  },
})

const emit = defineEmits(['update', 'remove'])

function addGroupRule() {
  if (!props.rule.rules) props.rule.rules = []
  props.rule.rules.push({
    type: "Minimum Average",
    value: 10
  })
  emitUpdate()
}

function removeGroupRule(index: number) {
  props.rule.rules.splice(index, 1)
  emitUpdate()
}

function emitUpdate() {
  emit('update', props.rule)
}
</script>
