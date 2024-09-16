<script setup lang="ts">
import ollama from 'ollama/browser'
import { computed, ref } from 'vue'
import IaMessage from './IaMessage.vue'
import Button from './components/ui/button/Button.vue'
import Input from './components/ui/input/Input.vue'
import Skeleton from './components/ui/skeleton/Skeleton.vue'

const SYSTEM_PROMPT = `Tu es une intelligence artificielle développée pour aider les personnes à écrire en écriture inclusive. Voici les recommendations : Il faut d'abord essayer d'utiliser les mots neutres en genre, puis il faut essayer d'utiliser le féminin puis le masculin. Dans le pire des cas, ou si la place ne le permet pas, il faut utiliser le point médian "·".
Voici quelques exemples :
Pour l'utilisation d'un mot neutre, plutôt que dire "bonjour les gars", utilisez plutôt "bonjour les gens"
Pour l'utilisation du féminin et du masculin, plutôt que d'utiliser "bonjour messieurs", utilisez plutôt "bonjour mesdames et messieurs"
Dans le pire des cas, plutôt que d'utiliser "levez vous tous!", utiliser "levez-vous tous·tes".
Tu dois aider les personnes en expliquant tout les cas possibles, et le premier message que tu vas recevoir est une demande d'aide pour écrire en inclusif.
Tu dois répondre à la question "je dois rendre ce message inclusif pour toutes et tout, comment faire ?"`

const message = ref('')
const messageHistory = ref<{ message: string; role: 'user' | 'assistant' }[]>([])

const loading = ref(false)
const disabledChat = ref(false)

async function requestOllama() {
  if (loading.value) {
    return
  }
  if (message.value === '') {
    return
  }

  messageHistory.value.unshift({ message: message.value, role: 'user' })

  try {
    loading.value = true
    disabledChat.value = true
    message.value = ''

    const messages = reversedChatHistory.value.map(({ message, role }) => ({
      content: message,
      role: role
    }))

    const response = await ollama.chat({
      model: 'phi3:14b',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      stream: true
    })
    loading.value = false

    messageHistory.value.unshift({ message: '', role: 'assistant' })
    for await (const part of response) {
      messageHistory.value[0].message = messageHistory.value[0].message + part.message.content
    }
    disabledChat.value = false
  } finally {
    loading.value = false
  }
}

const reversedChatHistory = computed(() => messageHistory.value.slice().reverse())
</script>

<template>
  <form
    @submit.prevent="requestOllama"
    class="relative flex flex-col py-5 gap-5 h-full min-h-full overflow-hidden"
  >
    <header class="px-4">
      <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Mon IA inclusive 💖
      </h1>
    </header>

    <div class="flex flex-col gap-2 w-full mb-16 overflow-y-scroll overflow-x-hidden py-0 px-4">
      <template v-for="{ message, role } in reversedChatHistory" :key="message">
        <IaMessage
          v-if="role === 'user'"
          class="w-8/12 mr-0 text-right"
          :message-markdown="message"
        />
        <IaMessage v-else :message-markdown="message" class="w-8/12 ml-0 text-left" />
      </template>
      <div v-show="loading" class="m-auto space-y-2 w-full">
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-8/12" />
      </div>
    </div>
    <footer
      class="flex flex-row justify-center items-center px-5 absolute bottom-0 left-0 gap-3 mt-auto h-16 bg-white w-full"
    >
      <Input autofocus type="text" v-model="message" :disabled="loading" />
      <Button type="submit" :disabled="loading">Send</Button>
    </footer>
  </form>
</template>

<style scoped></style>
