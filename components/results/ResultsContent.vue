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
        <span :class="{'text-gray-400': !hasAnyGrades}" class="font-medium">
          {{ displayAverage(globalAverage) }}/20
        </span>
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

        <div v-if="showUnsetGradesInfo" class="mt-2 flex items-center text-sm text-gray-500">
          <Info class="h-4 w-4 mr-1" />
          Certaines notes ne sont pas encore remplies
        </div>
      </div>
    </div>

    <!-- Group Statistics -->
    <div class="space-y-4">
      <div v-for="group in groupRules" :key="group.id" class="border rounded-lg p-3 lg:p-4 bg-white">
        <div class="flex flex-col lg:flex-row gap-2 lg:gap-0 items-start lg:items-center justify-between mb-4">
          <div class="flex items-center gap-2 flex-wrap">
            <h3 class="font-medium">{{ group.name }}</h3>
            <Badge :class="{'text-gray-400': !hasGroupGrades(group.id)}">
              {{ displayAverage(getGroupAverage(group.id)) }}/20
            </Badge>
            <Check v-if="isGroupPassing(group)" class="h-4 w-4 text-green-500"/>
            <XCircle v-else class="h-4 w-4 text-red-500"/>
          </div>
        </div>

        <!-- Group Rules Status -->
        <div class="space-y-2 border-l-2 border-gray-200 pl-4 mb-6">
          <h4 class="text-sm font-medium text-muted-foreground mb-2">Conditions de Validation</h4>
          <div v-for="rule in group.rules" :key="rule.type" 
               class="text-sm flex flex-col bg-gray-50 p-2 rounded-md">
            <div class="flex items-center justify-between">
              <span class="font-medium">{{ formatRuleDescription(rule) }}</span>
              <div class="flex items-center gap-2">
                <Badge variant="outline" class="bg-white">
                  {{ getRuleValue(group.id, rule) }}
                </Badge>
                <template v-if="rule.type === 'Minimum Validated'">
                  <Check v-if="getRuleStatus(group.id, rule) === 'passed'" class="h-4 w-4 text-green-500"/>
                  <XCircle v-else-if="getRuleStatus(group.id, rule) === 'failed'" class="h-4 w-4 text-red-500"/>
                  <Hourglass v-else class="h-4 w-4 text-gray-400"/>
                </template>
                <template v-else>
                  <Check v-if="isRulePassing(group.id, rule)" class="h-4 w-4 text-green-500"/>
                  <XCircle v-else class="h-4 w-4 text-red-500"/>
                </template>
              </div>
            </div>
            <div v-if="rule.type === 'Minimum Validated' && getRuleStatus(group.id, rule) === 'pending'" 
                 class="mt-1 flex items-center text-sm text-gray-500">
              <Info class="h-4 w-4 mr-1" />
              Certaines notes ne sont pas encore remplies
            </div>
          </div>
        </div>

        <!-- UE Details -->
        <div class="mt-4 space-y-2">
          <h4 class="text-sm font-medium text-muted-foreground mb-2">Détail des moyennes</h4>
          <div v-for="unit in getGroupUnits(group.id)" :key="unit.id" class="pl-4 border-l border-gray-100">
            <div class="flex items-center justify-between py-1">
              <span class="text-sm">{{ unit.name }}</span>
              <div class="flex items-center gap-1.5">
                <Badge variant="outline" :class="getBadgeClass(unit)">
                  {{ displayUnitAverage(unit) }}/20
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
import { Check, XCircle, Info, Hourglass } from 'lucide-vue-next'
import type { SimpleRuleType, GroupRuleType, GroupRule, TeachingUnit } from '@/utils/types'

const simulateEmptyGrades = inject('simulateEmptyGrades', { default: () => false })
const store = useValidationStore()

const groupRules = computed(() => store.rules.filter(r => r.type === 'Group Average') as GroupRuleType[])
const simpleRules = computed(() => store.rules.filter(r => r.type !== 'Group Average') as SimpleRuleType[])

const globalAverage = computed(() => {
  const avg = store.getGlobalAverage(simulateEmptyGrades.value)
  return avg !== null ? avg.toFixed(2) : "?"
})

const statusColorClass = computed(() =>
  store.result?.status === 'Validé' ? 'bg-green-700 text-white' : 'bg-red-700 text-white'
)

const hasAnyGrades = computed(() =>
  store.grades.some(g =>
    g.teachingUnits?.some(u =>
      !u.id.endsWith('-standalone') &&
      u.subjects.some(s => s.value !== null && s.value !== '')
    )
  )
)

const showUnsetGradesInfo = computed(() => store.hasUnsetGrades)

function getGroupUnits(groupId: string) {
  return store.grades.find(g => g.id === groupId)?.teachingUnits || []
}

function hasGroupGrades(groupId: string): boolean {
  const group = store.grades.find(g => g.id === groupId)
  return !!group?.teachingUnits?.some(u =>
    !u.id.endsWith('-standalone') &&
    u.subjects.some(s => s.value !== null && s.value !== '')
  )
}

function getBadgeClass(unit: TeachingUnit) {
  const average = store.getUnitAverage(unit.subjects, simulateEmptyGrades.value)
  if (!simulateEmptyGrades.value && average === null) {
    return 'text-gray-400 border-gray-200'
  }
  return average !== null && average >= 10
    ? 'bg-green-50 text-green-700 border-green-200'
    : 'bg-red-50 text-red-700 border-red-200'
}

function isRulePassing(groupId: string, rule: GroupRule): boolean {
  return !store.result?.messages.some(msg =>
    msg.includes(rule.type) && msg.includes(groupId)
  )
}

function formatRuleDescription(rule: GroupRule): string {
  switch (rule.type) {
    case 'Minimum Average': return `Moyenne minimale: ${rule.value}/20`
    case 'Minimum Validated': return `UE validées minimum: ${rule.value}`
    case 'Maximum Failures': return `Échecs maximum: ${rule.value}`
    default: return ''
  }
}

function getRuleValue(groupId: string, rule: GroupRule): string {
  const units = getGroupUnits(groupId)
  switch (rule.type) {
    case 'Minimum Average': {
      const avg = store.getGroupAverage(groupId, simulateEmptyGrades.value)
      console.log(avg)
      return avg !== null ? `${avg.toFixed(2)}/20` : "??.??/20"
    }
    case 'Minimum Validated': {
      const regularUnits = units.filter(u => !u.id.endsWith('-standalone'))
      const validCount = regularUnits.filter(u => {
        const avg = store.calculateUnitAverage(u.subjects, simulateEmptyGrades.value)
        return avg !== null && avg >= 10
      }).length
      return `${validCount}/${rule.value}`
    }
    case 'Maximum Failures': {
      const nonStandalone = units.filter(u => !u.id.endsWith('-standalone'))
      const failCount = nonStandalone.filter(u => {
        const avg = store.calculateUnitAverage(u.subjects, simulateEmptyGrades.value)
        return avg !== null && avg < 10
      }).length
      return `${failCount}/${rule.value}`
    }
    default:
      return ''
  }
}

function isGroupPassing(group: GroupRuleType): boolean {
  return !store.result?.messages.some(msg => msg.includes(group.name))
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
      return `${globalAverage.value}/20`
    case 'Maximum Failures':
      const failCount = store.grades.filter(g => g.value !== null && g.value < 10).length
      return `${failCount}/${rule.value}`
    case 'Minimum Grade':
      const values = store.grades.map(g => g.value).filter(v => v !== null) as number[]
      const minGrade = values.length > 0 ? Math.min(...values) : null
      return minGrade !== null ? `${minGrade}/20` : "??.??/20"
    default:
      return ''
  }
}

function isSimpleRulePassing(rule: SimpleRuleType): boolean {
  return !store.result?.messages.some(msg =>
    msg.includes(rule.type === 'Minimum Average' ? 'moyenne générale' : rule.type)
  )
}

function getRuleStatus(groupId: string, rule: GroupRule): string {
  const ruleKey = `${groupId}-${rule.type}`
  return store.ruleStatuses[ruleKey] || ''
}

function displayAverage(average: string | null): string {
  return average !== null ? average : "?"
}

function displayUnitAverage(unit: TeachingUnit): string {
  const average = store.calculateUnitAverage(unit.subjects, simulateEmptyGrades.value)
  return displayAverage(average !== null ? average.toFixed(2) : null)
}

function getGroupAverage(groupId: string): string {
  const avg = store.getGroupAverage(groupId, simulateEmptyGrades.value)
  return avg !== null ? avg.toFixed(2) : "?"
}

onMounted(() => {
  store.calculate()
})
</script>
