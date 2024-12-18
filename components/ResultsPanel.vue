<template>
  <!-- Desktop Panel -->
  <div class="hidden lg:flex flex-col w-1/3 h-full bg-gray-50">
    <div class="p-6 flex-shrink-0">
      <h2 class="text-xl font-bold">Résultats</h2>
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
      <DrawerFooter>
        <DrawerClose asChild>
          <Button variant="outline">Fermer</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>

<script setup lang="ts">
import { ChartBar, Settings } from 'lucide-vue-next'
</script>
