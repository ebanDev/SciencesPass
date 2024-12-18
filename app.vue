<template>
  <div class="h-screen flex overflow-hidden">
    <WelcomeDrawer />
    <SidebarProvider :defaultOpen="store.isPanelOpen">
      <RulesPanel />
      <main class="flex-1 relative overflow-hidden">
        <SidebarTrigger class="fixed top-6 left-6 z-50 hidden lg:flex" @click="store.togglePanel" />
        <div class="h-full overflow-auto">
          <NuxtPage />
        </div>
      </main>
    </SidebarProvider>
  </div>
</template>

<script setup>
const store = useValidationStore()
</script>

<style>
@media (max-width: 1024px) {
  .sidebar-open {
    overflow: hidden;
  }
}
</style>
