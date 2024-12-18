<template>
  <!-- Desktop Sidebar -->
  <Sidebar class="bg-gray-50 flex flex-col h-screen hidden lg:flex">
    <SidebarHeader class="p-6 h-16 pl-16 flex-shrink-0">
      <h2 class="text-xl font-bold mb-4">Règles de Validation</h2>
    </SidebarHeader>
    <SidebarContent class="flex-1 overflow-y-auto">
      <RulesList />
    </SidebarContent>
  </Sidebar>

  <!-- Mobile Drawer -->
  <Drawer class="lg:hidden">
    <DrawerTrigger asChild>
      <Button class="fixed bottom-4 left-4 shadow-lg z-50 lg:hidden w-[calc(50%-1.5rem)]" size="lg" variant="outline">
        <Settings class="mr-2 h-5 w-5" />
        Règles
      </Button>
    </DrawerTrigger>
    <DrawerContent class="h-[95vh]">
      <DrawerHeader>
        <DrawerTitle>Règles de Validation</DrawerTitle>
      </DrawerHeader>
      <div class="flex-1 overflow-auto">
        <RulesList />
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
import { Settings, ChartBar } from 'lucide-vue-next'
</script>
