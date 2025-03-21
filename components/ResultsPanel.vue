<template>
  <!-- Desktop Panel -->
  <div class="hidden lg:flex flex-col w-1/3 h-full bg-gray-50">
    <div class="p-6 flex-shrink-0">
      <h2 class="text-xl font-bold">Résultats</h2>
      
      <!-- Progress bar for desktop -->
      <div v-if="totalSubjects > 0" class="mt-4">
        <div class="flex justify-between text-sm mb-1">
          <span>Notes renseignées</span>
          <span>{{ filledSubjects }} / {{ totalSubjects }} matières</span>
        </div>
        <div class="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            class="h-full bg-primary rounded-full" 
            :style="{ width: `${(filledCoeffSum / totalCoeffSum) * 100}%` }"
          ></div>
        </div>
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>Coefficients: {{ filledCoeffSum.toFixed(1) }} / {{ totalCoeffSum.toFixed(1) }}</span>
          <span>{{ Math.round((filledCoeffSum / totalCoeffSum) * 100) }}%</span>
        </div>
      </div>
      
      <!-- Add simulation switch for desktop -->
      <div class="flex items-center justify-between mt-4">
        <Label class="text-sm">Simuler les notes vides avec un 10</Label>
        <Switch :checked="simulateEmptyGrades" @update:checked="simulateEmptyGrades = $event" />
      </div>
    </div>
    <div class="flex-1 overflow-y-auto">
      <ResultsContent />
    </div>
  </div>

  <!-- Mobile Drawer -->
  <Drawer class="lg:hidden">
    <DrawerTrigger asChild>
      <Button class="fixed bottom-4 right-4 shadow-lg lg:hidden w-[calc(50%-1.5rem)] z-50" size="lg" variant="outline">
        <ChartBar class="mr-2 h-5 w-5" />
        Résultats
      </Button>
    </DrawerTrigger>
    <DrawerContent class="h-[85vh]">
      <DrawerHeader>
        <DrawerTitle>Résultats</DrawerTitle>
        
        <!-- Progress bar for mobile -->
        <div v-if="totalSubjects > 0" class="mt-4">
          <div class="flex justify-between text-sm mb-1">
            <span>Notes renseignées</span>
            <span>{{ filledSubjects }} / {{ totalSubjects }} matières</span>
          </div>
          <div class="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              class="h-full bg-primary rounded-full" 
              :style="{ width: `${(filledCoeffSum / totalCoeffSum) * 100}%` }"
            ></div>
          </div>
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>Coefficient: {{ filledCoeffSum.toFixed(1) }} / {{ totalCoeffSum.toFixed(1) }}</span>
            <span>{{ Math.round((filledCoeffSum / totalCoeffSum) * 100) }}%</span>
          </div>
        </div>
      </DrawerHeader>
      <div class="flex-1 overflow-auto">
        <ResultsContent />
      </div>
      <DrawerFooter class="space-y-2">
        <!-- Keep simulation switch here for mobile -->
        <div class="flex items-center justify-between px-1">
          <Label class="text-sm">Simuler les notes vides avec un 10</Label>
          <Switch :checked="simulateEmptyGrades" @update:checked="simulateEmptyGrades = $event" />
        </div>
        <DrawerClose asChild>
          <Button variant="outline">Fermer</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>

<script setup lang="ts">
import { ChartBar, Settings } from 'lucide-vue-next'

const store = useValidationStore();

const simulateEmptyGrades = ref(false)

// Watch for simulation changes
watch(simulateEmptyGrades, (newValue) => {
  if (newValue) {
    store.calculateWithSimulation()
  } else {
    store.calculate()
  }
})

// Calculate total and filled subjects
const totalSubjects = computed(() => {
  return store.grades.reduce((count, group) => {
    return count + group.teachingUnits.reduce((unitCount, unit) => {
      return unitCount + unit.subjects.length
    }, 0)
  }, 0)
})

const filledSubjects = computed(() => {
  return store.grades.reduce((count, group) => {
    return count + group.teachingUnits.reduce((unitCount, unit) => {
      return unitCount + unit.subjects.filter(subject => 
        subject.value !== null && subject.value !== ''
      ).length
    }, 0)
  }, 0)
})

// Calculate coefficient sums
const totalCoeffSum = computed(() => {
  return store.grades.reduce((sum, group) => {
    return sum + group.teachingUnits.reduce((unitSum, unit) => {
      return unitSum + unit.subjects.reduce((subjectSum, subject) => {
        return subjectSum + (subject.coefficient || 1)
      }, 0)
    }, 0)
  }, 0)
})

const filledCoeffSum = computed(() => {
  return store.grades.reduce((sum, group) => {
    return sum + group.teachingUnits.reduce((unitSum, unit) => {
      return unitSum + unit.subjects.reduce((subjectSum, subject) => {
        if (subject.value !== null && subject.value !== '') {
          return subjectSum + (subject.coefficient || 1)
        }
        return subjectSum
      }, 0)
    }, 0)
  }, 0)
})

// Provide the simulation value to child components
provide('simulateEmptyGrades', simulateEmptyGrades)
</script>
