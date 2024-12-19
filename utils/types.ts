export interface Subject {
  id: string
  name: string
  coefficient: number
  value: number | null | ''
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
