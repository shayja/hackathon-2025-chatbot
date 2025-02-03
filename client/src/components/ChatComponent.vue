<template>
  <div class="chat-container">
    <div class="chat-window">
      <div class="chat-messages" ref="typingRef">
        <div
          v-if="messages?.length > 0"
          v-for="(message, index) in messages"
          :key="index"
          class="message"
          :class="message.isUser ? 'user-message right' : 'bot-message left'"
          :style="message.isUser ? 'justify-content: flex-start' : 'justify-content: flex-end'"
        >
          <!-- Bot message with logo -->
          <div v-if="!message.isUser" class="bot-message-wrapper">
            <img src="@/assets/logo.png" alt="Bot Icon" class="bot-icon" />
            <div class="message-bubble bot-bubble">
              <p>{{ message.text }}</p>
            </div>
          </div>

          <!-- User message with avatar -->
          <div v-else class="user-message-wrapper">
            <img src="@/assets/person.png" alt="User Icon" class="user-icon" />
            <div class="message-bubble user-bubble">
              <p>{{ message.text }}</p>
            </div>
          </div>

          <div v-if="message.hasImages" class="d-flex flex-direction" style="margin-top: 10px;">
            <div v-for="(step, index) in message.steps" :key="index" class="step">
              <img :src="step.image" :alt="step.step" />
            </div>
          </div>
        </div>

        <div class="message bot-message left" style="justify-content: flex-end">
          <div v-if="isTyping" class="bot-message-wrapper">
            <img src="@/assets/logo.png" alt="Bot Icon" class="bot-icon" />
            <TypingAnimation />
          </div>
        </div>

        <!-- Show Typing Animation if waiting for response -->

        <div v-if="messages?.length == 0" class="empty-chat">
          <span>צריך עזרה? פשוט הקלד את שאלתך ואשמח לעזור.</span>
        </div>
      </div>

      <div class="input-area">
        <input
          v-model="userInput"
          @keydown.enter="sendMessage"
          type="text"
          placeholder="כתוב הודעתך כאן..."
          class="input-field"
          :disabled="isTyping"
        />
        <button @click="sendMessage" :disabled="isTyping" class="send-button">שלח</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import axios from "axios"; // Ensure Axios is imported
import TypingAnimation from "./TypingAnimation.vue";

interface Message {
  text: string;
  isUser: boolean;
}

const messagesContainer = ref<HTMLElement | null>(null);
const messageRefs = ref<HTMLElement[]>([]);

const userInput = ref("");
const messages = ref<Message[]>([]);
const isTyping = ref(false); // Flag for typing animation
const typingRef = ref();

const sendMessage = async () => {
  if (userInput.value.trim()) {
    // Add user message to chat
    messages.value.push({ text: userInput.value, isUser: true });

    const userText = userInput.value; // Store user input
    userInput.value = ""; // Clear input field

    try {
      isTyping.value = true;
      // Send API request to the backend
      const response = await axios.post("http://localhost:3000/generate", {
        prompt: userText,
      });

      // Add bot response to chat
      let text = (response.data?.response as string) || "מצטערים משהו לא תקין בשרת.";
      let hasImages = false;
      let steps = null;

      if (text.includes("https")) {
        console.log("inside");

        const manipulatedTest = extractSteps(text);
        text = manipulatedTest.instructions;
        hasImages = true;
        steps = manipulatedTest.steps;
      }
      messages.value.push({ text: text, isUser: false, hasImages: hasImages, steps: steps });

      isTyping.value = false;
    } catch (error) {
      console.error("Error fetching bot response:", error);
      messages.value.push({ text: "סליחה משהו השתבש", isUser: false });
    }
  }
};

const extractSteps = (text: string): { instructions: string; steps: { step: string; image: string }[] } => {
  const steps: { step: string; image: string }[] = [];
  const regex = /- !\[(Step \d+)\]\((.*?)\)/g;

  // Extract the instruction part (text before the first step)
  const splitIndex = text.indexOf("- ![Step");
  const instructions = splitIndex !== -1 ? text.substring(0, splitIndex).trim() : text;

  let match;
  while ((match = regex.exec(text)) !== null) {
    steps.push({ step: match[1], image: match[2] });
  }

  return { instructions, steps };
};

watch(isTyping, () => {
  if (isTyping.value) {
    typingRef.value?.scrollIntoView({ behavior: "smooth", block: "end" });
  }
});
</script>

<style scoped>
.chat-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 15px;
  min-width: 100%;
  background-color: #f4f7fa;
}

.chat-window {
  width: 80%;
  max-width: 900px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 10px;
}

.chat-messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.empty-chat {
  display: flex;
  flex-direction: column;
  color: gray;
  font-size: large;
  width: 62%;
  height: 100%;
  justify-content: center;
  align-self: center;
  text-align: center;
}

/* Message Row */
.message {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

/* Bot message row (logo on left, message bubble right) */
.bot-message-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-direction: row-reverse;
}

.bot-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

/* User message row (message bubble left, avatar right) */
.user-message-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ccc; /* Placeholder color */
}

/* Message Bubbles */
.message-bubble {
  padding: 12px;
  border-radius: 20px;
  font-size: 14px;
  line-height: 1.4;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Bot Message Bubble */
.bot-bubble {
  background-color: #e5e5e5;
  color: black;
  position: relative;
}

.bot-bubble::before {
  content: "";
  position: absolute;
  top: 28px;
  left: -8px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #e5e5e5;
}

/* User Message Bubble */
.user-bubble {
  background-color: #e42e43;
  color: white;
  position: relative;
  min-width: 50px;
}

.user-bubble::before {
  content: "";
  position: absolute;
  top: 28px;
  right: -8px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #e42e43;
}

/* Input Area */
.input-area {
  display: flex;
  padding: 12px;
  background-color: #fff;
  border-top: 1px solid #ddd;
  justify-content: center;
  gap: 5px;
}

.input-field {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.send-button {
  background-color: #cd162b;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 12px 20px;
  margin-left: 10px;
  cursor: pointer;
  font-size: 14px;
}

.send-button:hover {
  background-color: #007aff;
}

.input-field {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd; /* Default border */
  border-radius: 20px;
  font-size: 14px;
  outline: none; /* Removes default browser outline */
  transition: border-color 0.3s ease-in-out; /* Smooth transition */
}

/* Change border color when input is focused */
.input-field:focus {
  border-color: #cd162b; /* WhatsApp green */
  box-shadow: 0 0 4px rgba(255, 0, 0, 0.5); /* Optional glow effect */
}

.step {
  margin-bottom: 10px;
  text-align: center;
}

.step img {
  width: 100%;
  max-width: 300px;
  border-radius: 10px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
}

@media (max-width: 600px) {
  .chat-window {
    width: 90%;
    min-height: 80vh;
    height: 100%;
  }
}
</style>
