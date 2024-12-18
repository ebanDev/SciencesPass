<template>
  <Drawer :open="store.isFirstVisit" modal>
    <DrawerContent class="h-[85vh]">
      <DrawerHeader>
        <DrawerTitle>Bienvenue sur SciencesPass</DrawerTitle>
        <DrawerDescription>
          Choisissez comment vous souhaitez commencer
        </DrawerDescription>
      </DrawerHeader>
      <div class="flex-1 p-6 space-y-4">
        <Button class="w-full h-24" variant="outline" @click="startWithTemplate">
          <Grape class="mr-2 h-5 w-5" />
          Sciences Po Bordeaux
        </Button>
        <Button class="w-full h-24" variant="outline" @click="startBlank">
          <FileText class="mr-2 h-5 w-5" />
          Configuration vide
        </Button>
      </div>
    </DrawerContent>
  </Drawer>
</template>

<script setup lang="ts">
import { FileText, Grape } from 'lucide-vue-next'
const store = useValidationStore()

function startBlank() {
  store.setFirstVisitComplete()
}

function startWithTemplate() {
  store.loadSciencesPoTemplate()
}
</script>
