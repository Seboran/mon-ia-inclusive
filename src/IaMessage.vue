<template>
  <div>
    <div v-html="md.render(messageMarkdown)"></div>
  </div>
</template>

<script setup lang="ts">
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.min.css'
import markdownit from 'markdown-it'

defineProps<{ messageMarkdown: string }>()

function highlightCode(str: string, lang: string) {
  let mainText
  if (shouldFormatCode(lang)) {
    const formatedCode = hljs.highlight(str, {
      language: lang,
      ignoreIllegals: true
    }).value

    mainText = formatedCode
  } else {
    mainText = md.utils.escapeHtml(str)
  }
  return `<pre>` + `<code class="hljs">${mainText}</code></pre>`
}

const md: markdownit = markdownit({
  highlight: highlightCode
})

/**
 * Returns true if lang is truthy and hljs recognizes this lang.
 *
 * @param lang
 */
function shouldFormatCode(lang: string) {
  return lang && hljs.getLanguage(lang)
}
</script>
