<template>
  <!-- Desktop Panel -->
  <div class="hidden lg:flex flex-col w-1/3 h-full bg-gray-50">
    <div class="p-6 flex-shrink-0">
      <h2 class="text-xl font-bold">Résultats</h2>
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

// Provide the simulation value to child components
provide('simulateEmptyGrades', simulateEmptyGrades)
</script>
