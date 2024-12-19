import { performCalculation, calculateUnitAverage, calculateGroupAverage, calculateGlobalAverage } from '@/utils/validationCalculations'
import { SCIENCES_PO_TEMPLATE } from '@/utils/constants'
import type { GradeEntry, Rule, TeachingUnit, Subject, Result, CalculationContext } from '@/utils/types'

export const useValidationStore = defineStore('validation', () => {
  const grades = ref<GradeEntry[]>([])
  const rules = ref<Rule[]>([])
  const result = ref<Result | null>(null)
  const isPanelOpen = ref(true)
  const isFirstVisit = ref(true)
  const hasUnsetGrades = ref(false)
  const ruleStatuses = ref<Record<string, 'passed' | 'failed' | 'pending'>>({})

  function calculate(simulateWithTen = false) {
    const { result: calcResult, hasUnsetGrades: unsetFlag, ruleStatuses: statuses } = performCalculation(grades.value, rules.value, simulateWithTen)
    result.value = calcResult
    hasUnsetGrades.value = unsetFlag
    ruleStatuses.value = statuses
  }

  function addRule(rule: Rule) {
    rules.value.push(rule)
  }

  function updateRule(updatedRule: Rule) {
    const index = rules.value.findIndex(r => r.id === updatedRule.id)
    if (index !== -1) rules.value[index] = updatedRule
  }

  function removeRule(id: string) {
    rules.value = rules.value.filter(r => r.id !== id)
  }

  function addGrade(grade: GradeEntry) {
    grades.value.push(grade)
  }

  function updateGrade(id: string, value: number | null, coefficient?: number, teachingUnits?: TeachingUnit[]) {
    const grade = grades.value.find(g => g.id === id)
    if (!grade) return
    if (value !== undefined) grade.value = value
    if (coefficient !== undefined) grade.coefficient = coefficient
    if (teachingUnits !== undefined) grade.teachingUnits = teachingUnits
  }

  function removeGrade(id: string) {
    grades.value = grades.value.filter(g => g.id !== id)
  }

  function addTeachingUnit(groupId: string, name: string) {
    const group = grades.value.find(g => g.id === groupId)
    if (!group) return
    if (!group.teachingUnits) group.teachingUnits = []
    group.teachingUnits.push({ id: Date.now().toString(), name, subjects: [] })
  }

  function addSubject(groupId: string, unitId: string, subject: Subject) {
    const group = grades.value.find(g => g.id === groupId)
    if (!group) return
    const unit = group.teachingUnits.find(u => u.id === unitId)
    if (!unit) return
    unit.subjects.push(subject)
  }

  function removeTeachingUnit(groupId: string, unitId: string) {
    const group = grades.value.find(g => g.id === groupId)
    if (!group) return
    group.teachingUnits = group.teachingUnits.filter(u => u.id !== unitId)
  }

  function removeSubject(groupId: string, unitId: string, subjectId: string) {
    const group = grades.value.find(g => g.id === groupId)
    if (!group) return
    const unit = group.teachingUnits.find(u => u.id === unitId)
    if (!unit) return
    unit.subjects = unit.subjects.filter(s => s.id !== subjectId)
  }

  function updateTeachingUnit(groupId: string, unitId: string, updates: Partial<TeachingUnit>) {
    const group = grades.value.find(g => g.id === groupId)
    if (!group) return
    const unit = group.teachingUnits.find(u => u.id === unitId)
    if (!unit) return
    Object.assign(unit, updates)
  }

  function addStandaloneSubject(groupId: string) {
    const group = grades.value.find(g => g.id === groupId)
    if (!group) return
    if (!group.teachingUnits) group.teachingUnits = []
    let standaloneUE = group.teachingUnits.find(u => u.id === `${groupId}-standalone`)
    if (!standaloneUE) {
      standaloneUE = {
        id: `${groupId}-standalone`,
        name: "Matières Indépendantes",
        subjects: []
      }
      group.teachingUnits.push(standaloneUE)
    }
    standaloneUE.subjects.push({
      id: Date.now().toString(),
      name: 'Nouvelle matière',
      value: null,
      coefficient: 1
    })
  }

  function togglePanel() {
    isPanelOpen.value = !isPanelOpen.value
  }

  function setFirstVisitComplete() {
    isFirstVisit.value = false
  }

  function loadSciencesPoTemplate() {
    grades.value = SCIENCES_PO_TEMPLATE.grades;
    rules.value = SCIENCES_PO_TEMPLATE.rules;
    setFirstVisitComplete();
    calculate();
  }

  function calculateWithSimulation() {
    calculate(true)
  }

  function getUnitAverage(subjects: Subject[], simulateWithTen = false): number | null {
    return calculateUnitAverage(subjects, simulateWithTen)
  }

  function getGroupAverage(groupId: string, simulateWithTen = false): number | null {
    const context: CalculationContext = {
      grades: grades.value,
      rules: rules.value,
      simulateWithTen
    }
    return calculateGroupAverage(context, groupId)
  }

  function getGlobalAverage(simulateWithTen = false): number | null {
    const context: CalculationContext = {
      grades: grades.value,
      rules: rules.value,
      simulateWithTen
    }
    return calculateGlobalAverage(context)
  }

  onMounted(() => {
    calculate()
  })

  watch([grades, rules], () => {
    calculate()
  }, { deep: true })

  return {
    grades,
    rules,
    result,
    isPanelOpen,
    isFirstVisit,
    hasUnsetGrades,
    ruleStatuses,
    calculate,
    addRule,
    updateRule,
    removeRule,
    addGrade,
    updateGrade,
    removeGrade,
    addTeachingUnit,
    addSubject,
    removeTeachingUnit,
    removeSubject,
    updateTeachingUnit,
    calculateUnitAverage,
    calculateGroupAverage,
    calculateGlobalAverage,
    addStandaloneSubject,
    togglePanel,
    setFirstVisitComplete,
    loadSciencesPoTemplate,
    calculateWithSimulation,
    getUnitAverage,
    getGroupAverage,
    getGlobalAverage
  }
}, {
  persist: {
    storage: piniaPluginPersistedstate.localStorage()
  },
})
