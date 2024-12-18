export interface Subject {
  id: string
  name: string
  coefficient: number
  value: number | null
}

export interface TeachingUnit {
  id: string
  name: string
  subjects: Subject[]
}

export interface GradeEntry {
  id: string
  name: string
  value: number | null
  coefficient?: number
  groupId?: string
  teachingUnits: TeachingUnit[]
}

export interface SimpleRuleType {
  id: string
  type: "Minimum Average" | "Maximum Failures" | "Minimum Grade"
  value: number
}

export interface GroupRule {
  type: "Minimum Average" | "Minimum Validated" | "Maximum Failures"
  value: number
}

export interface GroupRuleType {
  id: string
  type: "Group Average"
  name: string
  rules: GroupRule[]
  units: {
    name: string
    coefficient: number
    requiredCount?: number
  }[]
}

export type Rule = SimpleRuleType | GroupRuleType

export interface Result {
  status: string
  messages: string[]
}

const SCIENCES_PO_TEMPLATE = {
  grades: [
    {
      id: "1734531951260",
      name: "New Group",
      value: null,
      groupId: "1734531951260",
      teachingUnits: []
    },
    {
      id: "1734531954986",
      name: "New Group",
      value: null,
      groupId: "1734531954986",
      teachingUnits: [
        {
          id: "1734531969227",
          name: "UE 1 : Droit",
          subjects: [
            { id: "1734531979904", name: "Introduction générale au droit", value: 10, coefficient: 2 },
            { id: "1734531993236", name: "Institutions politiques françaises", value: 10, coefficient: 2 },
            { id: "1734531993973", name: "Droit constitutionnel comparé", value: 10, coefficient: 2 },
            { id: "1734531995541", name: "Constitution(s) et genre ", value: 10, coefficient: 1 }
          ]
        },
        {
          id: "1734531973018",
          name: "UE 2 : Économie",
          subjects: [
            { id: "1734532089063", name: "Introduction aux fondamentaux de l'économie", value: 10, coefficient: 2 },
            { id: "1734532089929", name: "Histoire de la pensée économique ", value: 10, coefficient: 2 },
            { id: "1734532090601", name: "Travail, emploi, chômage et discriminations dans les capitalismes contemporains", value: 10, coefficient: 1 }
          ]
        },
        {
          id: "1734531975345",
          name: "UE 3 : Histoire",
          subjects: [
            { id: "1734532745540", name: "Histoire politique de l'Europe au XIXe siècle", value: 10, coefficient: 2 },
            { id: "1734532746201", name: "Histoire politique de la France, IVe-Ve Républiques", value: 10, coefficient: 2 },
            { id: "1734532747017", name: "Histoire des démocraties, dictatures et totalitarismes au XXe siècle", value: 10, coefficient: 1 }
          ]
        },
        {
          id: "1734531976325",
          name: "UE 4 : Science politique et Sociologie",
          subjects: [
            { id: "1734532828346", name: "Introduction à la science politique", value: 10, coefficient: 2 },
            { id: "1734532829083", name: "Introduction à la sociologie générale", value: 10, coefficient: 2 },
            { id: "1734532838528", name: "État et gouvernement en Afriques ", value: 10, coefficient: 1 }
          ]
        }
      ]
    },
    {
      id: "1734532062384",
      name: "New Group",
      value: null,
      groupId: "1734532062384",
      teachingUnits: [
        {
          id: "1734533081456",
          name: "UE 5 : Enjeux contemporains",
          subjects: [
            { id: "1734533100933", name: "Du développement durable à la transition écologique", value: 10, coefficient: 3 },
            { id: "1734533102867", name: "Frontières des sciences", value: 10, coefficient: 1 },
            { id: "1734533103791", name: "Cours d'ouverture", value: 10, coefficient: 1 }
          ]
        },
        {
          id: "1734533144911",
          name: "UE 6 : Langues",
          subjects: [
            { id: "1734533158854", name: "Conf Anglais", value: 10, coefficient: 4 },
            { id: "1734533162269", name: "Conf Espagnol", value: 10, coefficient: 4 },
            { id: "1734533173617", name: "Épreuve Anglais", value: 10, coefficient: 2 },
            { id: "1734533178694", name: "Épreuve Espagnol", value: 10, coefficient: 2 }
          ]
        },
        {
          id: "1734533194678",
          name: "UE 7 : Maîtrise des outils",
          subjects: [
            { id: "1734533203913", name: "DECA 1", value: 10, coefficient: 2 },
            { id: "1734533215192", name: "DECA 2", value: 10, coefficient: 2 },
            { id: "1734533234242", name: "Modules complémentaires", value: 10, coefficient: 0 }
          ]
        },
        {
          id: "1734532062384-standalone",
          name: "Matières Indépendantes",
          subjects: [
            { id: "1734533889505", name: "Sport", value: 10, coefficient: 4 }
          ]
        }
      ]
    }
  ],
  rules: [
    {
      id: "1734531952211",
      type: "Minimum Average",
      value: 10
    },
    {
      id: "1734531954986",
      type: "Group Average",
      name: "Axe 1",
      rules: [
        { type: "Minimum Average", value: 10 },
        { type: "Minimum Validated", value: 3 }
      ],
      units: []
    },
    {
      id: "1734532062384",
      type: "Group Average",
      name: "Axe 2",
      rules: [
        { type: "Minimum Average", value: 10 },
        { type: "Minimum Validated", value: 2 }
      ],
      units: []
    }
  ]
} as const;

export const useValidationStore = defineStore('validation', () => {
  const grades = ref<GradeEntry[]>([])
  const rules = ref<Rule[]>([])
  const result = ref<Result | null>(null)
  const isPanelOpen = ref(true)
  const isFirstVisit = ref(true)

  function calculate() {
    const resultMessages: string[] = []
    let hasFailedRule = false

    // Check simple rules
    const simpleRules = rules.value.filter(r => r.type !== 'Group Average')
    simpleRules.forEach(rule => {
      if (rule.type === 'Minimum Average') {
        // Use the same logic as ResultsPanel for global average
        const groupRules = rules.value.filter(r => r.type === 'Group Average') as GroupRuleType[]
        const average = groupRules.length > 0 
          ? groupRules.reduce((sum, group) => sum + calculateGroupAverage(group.id), 0) / groupRules.length
          : 0

        if (average < rule.value) {
          hasFailedRule = true
          resultMessages.push(`La moyenne générale (${average.toFixed(2)}) est inférieure à ${rule.value}`)
        }
      }
    })

    // Check group rules
    const groupRules = rules.value.filter(r => r.type === 'Group Average') as GroupRuleType[]
    groupRules.forEach(group => {
      const groupId = group.id
      group.rules.forEach(rule => {
        const units = grades.value.find(g => g.id === groupId)?.teachingUnits || []
        
        switch (rule.type) {
          case 'Minimum Average':
            const average = calculateGroupAverage(groupId)
            if (average < rule.value) {
              hasFailedRule = true
              resultMessages.push(`${group.name}: La moyenne (${average.toFixed(2)}) est inférieure à ${rule.value}`)
            }
            break;
          case 'Minimum Validated':
            const regularUnits = units.filter(unit => !unit.id.endsWith('-standalone'))
            const validCount = regularUnits.filter(u => calculateUnitAverage(u.subjects) >= 10).length
            if (validCount < rule.value) {
              hasFailedRule = true
              resultMessages.push(`${group.name}: Nombre d'UE validées (${validCount}) inférieur au minimum requis (${rule.value})`)
            }
            break;
          case 'Maximum Failures':
            const nonStandaloneUnits = units.filter(unit => !unit.id.endsWith('-standalone'))
            const failCount = nonStandaloneUnits.filter(u => calculateUnitAverage(u.subjects) < 10).length
            if (failCount > rule.value) {
              hasFailedRule = true
              resultMessages.push(`${group.name}: Trop d'échecs (${failCount}) par rapport au maximum autorisé (${rule.value})`)
            }
            break;
        }
      })
    })

    result.value = { status: hasFailedRule ? 'Non validé' : 'Validé', messages: resultMessages }
  }

  // Remove or deprecate the old calculateAverage function since it's not used
  function calculateAverage(grades: GradeEntry[]): number {
    return calculateGlobalAverage()
  }

  // Add new helper function
  function calculateGlobalAverage(): number {
    const groupRules = rules.value.filter(r => r.type === 'Group Average') as GroupRuleType[]
    if (groupRules.length === 0) return 0
    
    return groupRules.reduce((sum, group) => 
      sum + calculateGroupAverage(group.id), 0
    ) / groupRules.length
  }

  function addRule(rule: Rule) {
    rules.value.push(rule)
  }

  function updateRule(updatedRule: Rule) {
    const index = rules.value.findIndex(r => r.id === updatedRule.id)
    if (index !== -1) {
      rules.value[index] = updatedRule
    }
  }

  function removeRule(id: string) {
    rules.value = rules.value.filter(r => r.id !== id)
  }

  function calculateUnitAverage(subjects: Subject[]): number {
    // Only consider subjects with numeric values
    const validSubjects = subjects.filter(s => s.value !== null && !isNaN(s.value))
    if (validSubjects.length === 0) return 0

    const totalWeighted = validSubjects.reduce((sum, subject) => 
      sum + (subject.value || 0) * subject.coefficient, 0
    )
    const totalCoef = validSubjects.reduce((sum, subject) => 
      sum + subject.coefficient, 0
    )

    return totalCoef > 0 ? totalWeighted / totalCoef : 0
  }

  function calculateGroupAverage(groupId: string): number {
    const group = grades.value.find(g => g.id === groupId)
    if (!group?.teachingUnits) return 0

    // Filter out standalone UE and empty units
    const regularUnits = group.teachingUnits.filter(unit => 
      !unit.id.endsWith('-standalone') && 
      unit.subjects.some(s => s.value !== null)
    )
    
    if (regularUnits.length === 0) return 0

    // Calculate weighted average of units
    const totalWeighted = regularUnits.reduce((sum, unit) => {
      const unitAvg = calculateUnitAverage(unit.subjects)
      return sum + unitAvg
    }, 0)

    return totalWeighted / regularUnits.length
  }

  function addGrade(grade: GradeEntry) {
    grades.value.push(grade)
  }

  function updateGrade(id: string, value: number | null, coefficient?: number, teachingUnits?: TeachingUnit[]) {
    const grade = grades.value.find(g => g.id === id)
    if (grade) {
      if (value !== undefined) grade.value = value
      if (coefficient !== undefined) grade.coefficient = coefficient
      if (teachingUnits !== undefined) grade.teachingUnits = teachingUnits
    }
  }

  function removeGrade(id: string) {
    grades.value = grades.value.filter(g => g.id !== id)
  }

  function addTeachingUnit(groupId: string, name: string) {
    const group = grades.value.find(g => g.id === groupId)
    if (group) {
      if (!group.teachingUnits) group.teachingUnits = []
      group.teachingUnits.push({
        id: Date.now().toString(),
        name,
        subjects: []
      })
    }
  }

  function addSubject(groupId: string, unitId: string, subject: Subject) {
    const group = grades.value.find(g => g.id === groupId)
    if (group) {
      const unit = group.teachingUnits?.find(u => u.id === unitId)
      if (unit) {
        unit.subjects.push(subject)
      }
    }
  }

  function removeTeachingUnit(groupId: string, unitId: string) {
    const group = grades.value.find(g => g.id === groupId)
    if (group && group.teachingUnits) {
      group.teachingUnits = group.teachingUnits.filter(u => u.id !== unitId)
    }
  }

  function removeSubject(groupId: string, unitId: string, subjectId: string) {
    const group = grades.value.find(g => g.id === groupId)
    if (group) {
      const unit = group.teachingUnits?.find(u => u.id === unitId)
      if (unit) {
        unit.subjects = unit.subjects.filter(s => s.id !== subjectId)
      }
    }
  }

  function updateTeachingUnit(groupId: string, unitId: string, updates: Partial<TeachingUnit>) {
    const group = grades.value.find(g => g.id === groupId)
    if (group) {
      const unit = group.teachingUnits?.find(u => u.id === unitId)
      if (unit) {
        Object.assign(unit, updates)
      }
    }
  }

  function addStandaloneSubject(groupId: string) {
    const group = grades.value.find(g => g.id === groupId)
    if (group) {
      if (!group.teachingUnits) group.teachingUnits = []
      // Create or get the standalone subjects UE
      let standaloneUE = group.teachingUnits.find(u => u.id === `${groupId}-standalone`)
      if (!standaloneUE) {
        standaloneUE = {
          id: `${groupId}-standalone`,
          name: "Matières Indépendantes",
          subjects: []
        }
        group.teachingUnits.push(standaloneUE)
      }
      // Add the new subject
      standaloneUE.subjects.push({
        id: Date.now().toString(),
        name: 'Nouvelle matière',
        value: null,
        coefficient: 1
      })
    }
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
    calculate(); // Recalculate results with new data
  }

  // Add initial calculation
  onMounted(() => {
    calculate()
  })

  // Add watchers for automatic recalculation
  watch([grades, rules], () => {
    calculate()
  }, { deep: true })

  return {
    grades,
    rules,
    result,
    isPanelOpen,
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
    addStandaloneSubject,
    togglePanel,
    isFirstVisit,
    setFirstVisitComplete,
    loadSciencesPoTemplate,
  }
}, {
  persist: {
    storage: piniaPluginPersistedstate.localStorage()
  },
})
