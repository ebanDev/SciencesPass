<template>
  <div class="space-y-6 p-4 sm:p-6">
    <div class="space-y-6">
      <div v-for="rule in rules" :key="rule.id">
        <component
          :is="rule.type === 'Group Average' ? RuleGroup : SimpleRule"
          :rule="rule"
          @update="updateRule"
          @remove="removeRule"
          :class="[
            rule.type === 'Group Average' ? 'border rounded-md bg-white' : '',
            'p-4 sm:p-6'
          ]"
        />
      </div>
    </div>
    <div class="flex flex-col sm:flex-row gap-3 sm:gap-2">
      <Button @click="addSimpleRule">
        <Plus class="mr-2" /> Règle Simple
      </Button>
      <Button @click="addGroupRule">
        <FolderPlus class="mr-2" /> Règle de Groupe
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, FolderPlus } from 'lucide-vue-next'
import { SimpleRule, RuleGroup } from "#components"

const store = useValidationStore()
const rules = computed(() => store.rules)

function addSimpleRule() {
  const newRule: SimpleRuleType = {
    id: Date.now().toString(),
    type: "Minimum Average",
    value: 10,
  }
  store.addRule(newRule)
}

function addGroupRule() {
  const groupId = Date.now().toString()
  const newRule: GroupRuleType = {
    id: groupId,
    type: "Group Average",
    name: "New Group",
    rules: [{
      type: "Minimum Average",
      value: 10
    }],
    units: [],
  }
  store.addRule(newRule)
  
  store.addGrade({
    id: groupId,
    name: "New Group",
    value: null,
    groupId,
    teachingUnits: []
  })
}

function updateRule(updatedRule: Rule) {
  store.updateRule(updatedRule)
}

function removeRule(id: string) {
  store.removeRule(id)
}
</script>
