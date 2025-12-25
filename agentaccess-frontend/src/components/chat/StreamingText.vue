<template>
  <span>{{ text }}</span>
</template>

<script setup lang="ts">
interface Props {
  text: string
  isStreaming: boolean
}

defineProps<Props>()
</script>
