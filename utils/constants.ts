// utils/constants.ts
import { GradeEntry, Rule } from './types'

export const SCIENCES_PO_TEMPLATE = {
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
            { id: "1734531979904", name: "Introduction générale au droit", value: '', coefficient: 2 },
            { id: "1734531993236", name: "Institutions politiques françaises", value: '', coefficient: 2 },
            { id: "1734531993973", name: "Droit constitutionnel comparé", value: '', coefficient: 2 },
            { id: "1734531995541", name: "Constitution(s) et genre ", value: '', coefficient: 1 }
          ]
        },
        {
          id: "1734531973018",
          name: "UE 2 : Économie",
          subjects: [
            { id: "1734532089063", name: "Introduction aux fondamentaux de l'économie", value: '', coefficient: 2 },
            { id: "1734532089929", name: "Histoire de la pensée économique ", value: '', coefficient: 2 },
            { id: "1734532090601", name: "Travail, emploi, chômage et discriminations dans les capitalismes contemporains", value: '', coefficient: 1 }
          ]
        },
        {
          id: "1734531975345",
          name: "UE 3 : Histoire",
          subjects: [
            { id: "1734532745540", name: "Histoire politique de l'Europe au XIXe siècle", value: '', coefficient: 2 },
            { id: "1734532746201", name: "Histoire politique de la France, IVe-Ve Républiques", value: '', coefficient: 2 },
            { id: "1734532747017", name: "Histoire des démocraties, dictatures et totalitarismes au XXe siècle", value: '', coefficient: 1 }
          ]
        },
        {
          id: "1734531976325",
          name: "UE 4 : Science politique et Sociologie",
          subjects: [
            { id: "1734532828346", name: "Introduction à la science politique", value: '', coefficient: 2 },
            { id: "1734532829083", name: "Introduction à la sociologie générale", value: '', coefficient: 2 },
            { id: "1734532838528", name: "État et gouvernement en Afriques ", value: '', coefficient: 1 }
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
            { id: "1734533100933", name: "Du développement durable à la transition écologique", value: '', coefficient: 3 },
            { id: "1734533102867", name: "Frontières des sciences", value: '', coefficient: 1 },
            { id: "1734533103791", name: "Cours d'ouverture", value: '', coefficient: 1 }
          ]
        },
        {
          id: "1734533144911",
          name: "UE 6 : Langues",
          subjects: [
            { id: "1734533158854", name: "Conf Anglais", value: '', coefficient: 4 },
            { id: "1734533162269", name: "Conf Espagnol", value: '', coefficient: 4 },
            { id: "1734533173617", name: "Épreuve Anglais", value: '', coefficient: 2 },
            { id: "1734533178694", name: "Épreuve Espagnol", value: '', coefficient: 2 }
          ]
        },
        {
          id: "1734533194678",
          name: "UE 7 : Maîtrise des outils",
          subjects: [
            { id: "1734533203913", name: "DECA 1", value: '', coefficient: 2 },
            { id: "1734533215192", name: "DECA 2", value: '', coefficient: 2 },
            { id: "1734533234242", name: "Modules complémentaires", value: '', coefficient: 0 }
          ]
        },
        {
          id: "1734532062384-standalone",
          name: "Matières Indépendantes",
          subjects: [
            { id: "1734533889505", name: "Sport", value: '', coefficient: 4 }
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

export const DEFAULT_RESULT = { status: 'En attente', messages: [] }

export type TemplateData = {
  grades: GradeEntry[]
  rules: Rule[]
}
