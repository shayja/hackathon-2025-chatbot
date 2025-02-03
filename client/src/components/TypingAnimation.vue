<template>
  <div class="typing-animation">
    <span class="dot">.</span>
    <span class="dot">.</span>
    <span class="dot">.</span>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.typing-animation {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: gray; /* WhatsApp green */
}

.dot {
  animation: typing 1.5s infinite;
}

.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.3s;
}

.dot:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes typing {
  0%,
  100% {
    opacity: 0;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-8px); /* Move the dots up */
  }
}
</style>
