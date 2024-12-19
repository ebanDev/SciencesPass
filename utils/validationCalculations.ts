import type { GradeEntry, Rule, GroupRuleType, Subject, Result } from './types'

interface CalculationContext {
  grades: GradeEntry[]
  rules: Rule[]
  simulateWithTen?: boolean
}

function calculateUnitAverage(subjects: Subject[], simulateWithTen = false): number | null {
  if (!subjects || subjects.length === 0) return null

  const validSubjects = subjects.filter(s => {
    let val = s.value
    if (simulateWithTen && (val === '' || val === null)) val = 10
    return val !== '' && val !== null && !isNaN(Number(val))
  })

  if (validSubjects.length === 0) return null

  const coeffSum = validSubjects.reduce((sum, s) => sum + s.coefficient, 0)
  if (coeffSum === 0) return null

  const total = validSubjects.reduce((sum, s) => {
    let val = s.value
    if (simulateWithTen && (val === '' || val === null)) val = 10
    return sum + Number(val) * s.coefficient
  }, 0)

  return total / coeffSum
}

function calculateGroupAverage(context: CalculationContext, groupId: string): number | null {
  if (!context.grades || !Array.isArray(context.grades)) return null
  const group = context.grades.find(g => g.id === groupId)
  if (!group?.teachingUnits) return null

  // Include all units (both regular and standalone) for average calculation
  const allUnits = group.teachingUnits
  if (allUnits.length === 0) return null

  const averages = allUnits.map(u => calculateUnitAverage(u.subjects, !!context.simulateWithTen))
  if (context.simulateWithTen) {
    const simulationAverages = averages.map(a => (a === null ? 10 : a as number))
    return simulationAverages.reduce((sum, a) => sum + a, 0) / simulationAverages.length
  }

  const validAverages = averages.filter(a => a !== null) as number[]
  return validAverages.length > 0
    ? validAverages.reduce((sum, a) => sum + a, 0) / validAverages.length
    : null
}

function calculateGlobalAverage(context: CalculationContext): number | null {
  if (!context.rules || !Array.isArray(context.rules)) return null
  const groupRules = (context.rules.filter(r => r.type === 'Group Average') as GroupRuleType[]) || []
  if (groupRules.length === 0) return null

  const averages = groupRules.map(gr => calculateGroupAverage(context, gr.id))
  if (context.simulateWithTen) {
    const simulationAverages = averages.map(a => (a === null ? 10 : a as number))
    return simulationAverages.reduce((sum, a) => sum + a, 0) / simulationAverages.length
  }

  const valid = averages.filter(a => a !== null) as number[]
  return valid.length > 0
    ? valid.reduce((sum, a) => sum + a, 0) / valid.length
    : null
}

interface CalculationResult {
  result: Result
  hasUnsetGrades: boolean
  ruleStatuses: Record<string, 'passed' | 'failed' | 'pending'>
}

export function performCalculation(grades: GradeEntry[], rules: Rule[], simulateWithTen = false): CalculationResult {
  // If grades or rules are not defined or not arrays, return early
  if (!Array.isArray(grades)) grades = []
  if (!Array.isArray(rules)) rules = []

  const resultMessages: string[] = []
  let hasFailedRule = false
  let hasUnsetGrades = false
  const ruleStatuses: Record<string, 'passed' | 'failed' | 'pending'> = {}

  const context: CalculationContext = { grades, rules, simulateWithTen }

  // Simple rules
  const simpleRules = rules.filter(r => r.type !== 'Group Average')
  for (const rule of simpleRules) {
    if (rule.type === 'Minimum Average') {
      const avg = calculateGlobalAverage(context)
      if (avg !== null && avg < rule.value) {
        hasFailedRule = true
        resultMessages.push(`La moyenne générale (${avg.toFixed(2)}) est inférieure à ${rule.value}`)
      }
    }
  }

  // Group rules
  const groupRules = rules.filter(r => r.type === 'Group Average') as GroupRuleType[]
  for (const group of groupRules) {
    const units = grades.find(g => g.id === group.id)?.teachingUnits || []
    for (const rule of group.rules) {
      const ruleKey = `${group.id}-${rule.type}`
      switch (rule.type) {
        case 'Minimum Average': {
          const avg = calculateGroupAverage(context, group.id)
          if (avg !== null && avg < rule.value) {
            hasFailedRule = true
            resultMessages.push(`${group.name}: La moyenne (${avg.toFixed(2)}) est inférieure à ${rule.value}`)
          }
          break
        }
        case 'Minimum Validated': {
          // Only consider regular units (non-standalone) for minimum validated rule
          const regularUnits = units.filter(u => !u.id.endsWith('-standalone'))
          let validCount = 0
          let pending = false

          for (const u of regularUnits) {
            const avg = calculateUnitAverage(u.subjects, simulateWithTen)
            if (!simulateWithTen && avg === null) {
              hasUnsetGrades = true
              pending = true
            } else if (avg !== null && avg >= 10) {
              validCount++
            }
          }

          if (!simulateWithTen && pending) {
            ruleStatuses[ruleKey] = 'pending'
          } else if (validCount < rule.value) {
            hasFailedRule = true
            ruleStatuses[ruleKey] = 'failed'
            resultMessages.push(`${group.name}: Nombre d'UE validées (${validCount}) inférieur au minimum requis (${rule.value})`)
          } else {
            ruleStatuses[ruleKey] = 'passed'
          }
          break
        }
        case 'Maximum Failures': {
          // Consider all units (including standalone) for maximum failures rule
          const allUnits = units
          const failCount = allUnits.filter(u => {
            const avg = calculateUnitAverage(u.subjects, simulateWithTen)
            return avg !== null && avg < 10
          }).length
          if (failCount > rule.value) {
            hasFailedRule = true
            resultMessages.push(`${group.name}: Trop d'échecs (${failCount}) par rapport au maximum autorisé (${rule.value})`)
          }
          break
        }
      }
    }
  }

  const status = hasFailedRule ? 'Non validé' : 'Validé'
  return { result: { status, messages: resultMessages }, hasUnsetGrades, ruleStatuses }
}

export { calculateUnitAverage, calculateGroupAverage, calculateGlobalAverage }
