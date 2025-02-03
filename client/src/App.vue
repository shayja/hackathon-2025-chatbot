<template>
  <div class="container">
    <TitleComponent />
    <ChatComponent />
  </div>
</template>

<script setup lang="ts">
import ChatComponent from "./components/ChatComponent.vue";
import TitleComponent from "./components/TitleComponent.vue";
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 5%;
}
</style>
