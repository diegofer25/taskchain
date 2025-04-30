<template>
  <canvas ref="canvasRef"></canvas>
</template>

<script lang="ts" setup generic="T extends Readonly<StrictInput[]>">
import { useRive, type RiveInstance, type StrictInput } from '@/modules/global/composables/use-rive'
import type { Event } from '@rive-app/webgl'
import { ref } from 'vue'

interface Props {
  src: string
  autoplay?: boolean
  stateMachineName?: string
  autoBind?: boolean
  inputs?: T
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'loaded', instance: RiveInstance): void
  (e: 'stateChange', event: Event): void
}>()
const canvasRef = ref<HTMLCanvasElement | null>(null)

const instance = useRive({
  canvasRef,
  src: props.src,
  stateMachineName: props.stateMachineName,
  autoplay: props.autoplay || undefined,
  autoBind: props.autoBind || undefined,
  inputs: props.inputs,
  onLoad: () => emit('loaded', instance),
  onStateChange: (event) => emit('stateChange', event),
})
</script>
