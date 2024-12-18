<template>
  <div class="flex flex-col gap-2 p-4 border rounded-md bg-white">
    <div class="flex items-end gap-2">
      <div class="flex-1">
        <Label class="mb-1 inline-flex items-center">
          <Sigma size="1rem" class="mr-1" />
          Règle
        </Label>
        <Select v-model="rule.type">
          <SelectTrigger>
            <SelectValue>{{ rule.type }}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Minimum Average">Moyenne Minimale</SelectItem>
            <SelectItem value="Maximum Failures">Nombre Maximum d'Échecs</SelectItem>
            <SelectItem value="Minimum Grade">Note Minimale</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="w-24">
        <Label class="mb-1 inline-flex items-center">
          <Hash size="1rem" class="mr-1" />
          Valeur
        </Label>
        <Input v-model.number="rule.value" type="number" min="0" step="0.1" />
      </div>
    </div>
    <Button variant="destructive" @click="$emit('remove', rule.id)" size="icon" class="self-end">
      <Trash2 />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Trash2, Sigma, Hash } from 'lucide-vue-next';

interface SimpleRule {
  id: string;
  type: string;
  value: number;
}

const props = defineProps<{
  rule: SimpleRule;
}>();

const emit = defineEmits(['update', 'remove']);

watch(
  () => props.rule.type,
  () => emit('update', props.rule)
);

watch(
  () => props.rule.value,
  () => emit('update', props.rule)
);
</script>
