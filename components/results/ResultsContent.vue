<template>
  <div class="flex flex-col gap-4 p-3 sm:p-6">
    <!-- Overall Status -->
    <div class="border rounded-lg p-4 bg-white space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="font-medium">Status Global</h3>
        <Badge :class="statusColorClass">
          {{ store.result?.status || 'En attente' }}
        </Badge>
      </div>
      
      <!-- Global Average -->
      <div class="flex items-center gap-2">
        <span class="text-sm text-muted-foreground">Moyenne générale:</span>
        <span class="font-medium">{{ globalAverage.toFixed(2) }}/20</span>
      </div>

      <!-- Global Conditions -->
      <div v-if="simpleRules.length > 0" class="pt-4 border-t">
        <h4 class="text-sm font-medium text-muted-foreground mb-2">Conditions Globales</h4>
        <div class="space-y-2">
          <div v-for="rule in simpleRules" :key="rule.id" 
               class="text-sm flex items-center justify-between bg-gray-50 p-2 rounded-md">
            <span class="font-medium">{{ formatSimpleRuleDescription(rule) }}</span>
            <div class="flex items-center gap-2">
              <Badge variant="outline" class="bg-white">{{ getSimpleRuleValue(rule) }}</Badge>
              <Check v-if="isSimpleRulePassing(rule)" class="h-4 w-4 text-green-500"/>
              <XCircle v-else class="h-4 w-4 text-red-500"/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Group Statistics -->
    <div class="space-y-4">
      <div v-for="group in groupRules" :key="group.id" class="border rounded-lg p-3 lg:p-4 bg-white">
        <div class="flex flex-col lg:flex-row gap-2 lg:gap-0 items-start lg:items-center justify-between mb-4">
          <div class="flex items-center gap-2 flex-wrap">
            <h3 class="font-medium">{{ group.name }}</h3>
            <Badge>{{ store.calculateGroupAverage(group.id).toFixed(2) }}/20</Badge>
            <Check v-if="isGroupPassing(group)" class="h-4 w-4 text-green-500"/>
            <XCircle v-else class="h-4 w-4 text-red-500"/>
          </div>
        </div>

        <!-- Group Rules Status -->
        <div class="space-y-2 border-l-2 border-gray-200 pl-4 mb-6">
          <h4 class="text-sm font-medium text-muted-foreground mb-2">Conditions de Validation</h4>
          <div v-for="rule in group.rules" :key="rule.type" 
               class="text-sm flex items-center justify-between bg-gray-50 p-2 rounded-md">
            <span class="font-medium">{{ formatRuleDescription(rule) }}</span>
            <div class="flex items-center gap-2">
              <Badge variant="outline" class="bg-white">
                {{ getRuleValue(group.id, rule) }}
              </Badge>
              <Check v-if="isRulePassing(group.id, rule)" 
                     class="h-4 w-4 text-green-500"/>
              <XCircle v-else class="h-4 w-4 text-red-500"/>
            </div>
          </div>
        </div>

        <!-- UE Details -->
        <div class="mt-4 space-y-2">
          <h4 class="text-sm font-medium text-muted-foreground mb-2">Détail des moyennes</h4>
          <div v-for="unit in getGroupUnits(group.id)" :key="unit.id" 
               class="pl-4 border-l border-gray-100">
            <div class="flex items-center justify-between py-1">
              <span class="text-sm">{{ unit.name }}</span>
              <div class="flex items-center gap-1.5">
                <Badge variant="outline" :class="
                  isUnitPassing(unit) 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'bg-red-50 text-red-700 border-red-200'
                ">
                  {{ store.calculateUnitAverage(unit.subjects).toFixed(2) }}/20
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, XCircle } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'

const store = useValidationStore()

const groupRules = computed(() => 
  store.rules.filter(rule => rule.type === 'Group Average') as GroupRuleType[]
)

const simpleRules = computed(() => 
  store.rules.filter(rule => rule.type !== 'Group Average') as SimpleRuleType[]
)

const globalAverage = computed(() => {
  const groups = groupRules.value
  if (groups.length === 0) return 0
  return groups.reduce((sum, group) => 
    sum + store.calculateGroupAverage(group.id), 0
  ) / groups.length
})

// Add this computed property
const statusColorClass = computed(() => {
  return store.result?.status === 'Validé' 
    ? 'bg-green-700 text-white' 
    : 'bg-red-700 text-white'
})

function getGroupUnits(groupId: string) {
  return store.grades.find(g => g.id === groupId)?.teachingUnits || []
}

function isRulePassing(groupId: string, rule: GroupRule): boolean {
  const failMessage = store.result?.messages.find(msg => 
    msg.includes(rule.type) && msg.includes(groupId)
  )
  return !failMessage
}

function formatRuleDescription(rule: GroupRule): string {
  switch (rule.type) {
    case 'Minimum Average':
      return `Moyenne minimale: ${rule.value}/20`
    case 'Minimum Validated':
      return `UE validées minimum: ${rule.value}`
    case 'Maximum Failures':
      return `Échecs maximum: ${rule.value}`
    default:
      return ''
  }
}

function getRuleValue(groupId: string, rule: GroupRule): string {
  const units = getGroupUnits(groupId)
  switch (rule.type) {
    case 'Minimum Average':
      return `${store.calculateGroupAverage(groupId).toFixed(2)}/20`
    case 'Minimum Validated':
      const regularUnits = units.filter(unit => !unit.id.endsWith('-standalone'))
      const validCount = regularUnits.filter(u => 
        store.calculateUnitAverage(u.subjects) >= 10
      ).length
      return `${validCount}/${rule.value}`
    case 'Maximum Failures':
      const nonStandaloneUnits = units.filter(unit => !unit.id.endsWith('-standalone'))
      const failCount = nonStandaloneUnits.filter(u => 
        store.calculateUnitAverage(u.subjects) < 10
      ).length
      return `${failCount}/${rule.value}`
    default:
      return ''
  }
}

function isGroupPassing(group: GroupRuleType): boolean {
  return !store.result?.messages.some(msg => msg.includes(group.name))
}

function isUnitPassing(unit: TeachingUnit): boolean {
  return store.calculateUnitAverage(unit.subjects) >= 10
}

function formatSimpleRuleDescription(rule: SimpleRuleType): string {
  switch (rule.type) {
    case 'Minimum Average':
      return `Moyenne générale minimale: ${rule.value}/20`
    case 'Maximum Failures':
      return `Nombre maximum d'échecs: ${rule.value}`
    case 'Minimum Grade':
      return `Note minimale: ${rule.value}/20`
    default:
      return ''
  }
}

function getSimpleRuleValue(rule: SimpleRuleType): string {
  switch (rule.type) {
    case 'Minimum Average':
      return `${globalAverage.value.toFixed(2)}/20`
    case 'Maximum Failures':
      const failCount = store.grades.filter(g => (g.value || 0) < 10).length
      return `${failCount}/${rule.value}`
    case 'Minimum Grade':
      const minGrade = Math.min(...store.grades.map(g => g.value || 20))
      return `${minGrade}/20`
    default:
      return ''
  }
}

function isSimpleRulePassing(rule: SimpleRuleType): boolean {
  return !store.result?.messages.some(msg => 
    msg.includes(rule.type === 'Minimum Average' ? 'moyenne générale' : rule.type)
  )
}

// Ensure calculation happens when component mounts
onMounted(() => {
  store.calculate()
})
</script>
