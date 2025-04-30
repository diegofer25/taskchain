<template>
  <canvas ref="canvasRef"></canvas>
</template>

<script lang="ts" setup>
import { useRive, type StrictInput } from '@/modules/global/composables/use-rive'
import { ref } from 'vue'

interface Props {
  src: string
  autoplay?: boolean
  stateMachineName?: string
  autoBind?: boolean
  inputs?: StrictInput[]
}

const props = defineProps<Props>()
const emit = defineEmits(['loaded', 'stateChange'])
const canvasRef = ref<HTMLCanvasElement | null>(null)

useRive({
  canvasRef,
  src: props.src,
  stateMachineName: props.stateMachineName,
  autoplay: props.autoplay || undefined,
  autoBind: props.autoBind || undefined,
  inputs: props.inputs,
  onLoad: (rive) => emit('loaded', rive),
  onStateChange: (event) => emit('stateChange', event),
})
</script>
