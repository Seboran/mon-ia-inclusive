<script setup lang="ts">
import ollama from 'ollama/browser'
import { ref } from 'vue'
import IaMessage from './IaMessage.vue'

const message = ref('')
const responseHistory = ref<string[]>([])

const loading = ref(false)

async function requestOllama() {
  if (loading.value) {
    return
  }
  if (message.value === '') {
    return
  }

  try {
    loading.value = true
    const response = await ollama.chat({
      model: 'phi3:14b',
      messages: [{ content: message.value, role: 'user' }],
      stream: true
    })
    responseHistory.value.unshift('')
    for await (const part of response) {
      const lastMessage = responseHistory.value[0]
      responseHistory.value[0] = lastMessage + part.message.content
    }
    message.value = ''
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="requestOllama" class="container">
    <h1>Mon IA inclusive 💖</h1>

    <div>
      <input type="text" v-model="message" />
      <button type="submit">Send</button>
    </div>

    <div>
      <div v-show="loading">Loading...</div>
      <template v-for="message in responseHistory" :key="message">
        <IaMessage :message-markdown="message" />
      </template>
    </div>
  </form>
</template>

<style scoped></style>
