import { Rive, StateMachineInput, StateMachineInputType, type EventCallback } from '@rive-app/webgl'
import { useDebounceFn, useEventListener } from '@vueuse/core'
import { onMounted, onUnmounted, type Ref } from 'vue'

/**
 * ### A composable for integrating Rive animations in Vue.
 *
 * #### Usage:
 *  - Provide a canvasRef to an HTMLCanvasElement.
 *  - Specify the Rive file source (src) and a state machine name.
 *  - Configure optional inputs to drive the animation reactively.
 *
 * #### Methods:
 *  - getInput: Returns an input object for controlling the Rive animation programmatically.
 *
 * #### Basic usage Example:
 * ```ts
 * useRive({ canvasRef, src: 'path/to/file.riv' })
 * ```
 *
 * #### Full Feature usage Example:
 * ```ts
 *  const { getInput } = useRive({
 *    canvasRef,
 *    src: 'path/to/file.riv',
 *    stateMachineName: 'StateMachine',
 *    inputs: [{ name: 'isActive', type: StateMachineInputType.Boolean, defaultValue: false }] as const,
 *    onLoad: (riveInstance) => { console.log('Loaded!', riveInstance) },
 *    onStateChange: (state) => { console.log('State changed!', state) },
 *  });
 * ```
 */
export function useRive<I extends ReadonlyArray<StrictInput>>(options: UseRiveOption<I>) {
  const {
    canvasRef,
    src,
    autoplay = true,
    autoBind = false,
    stateMachineName = 'State Machine 1',
    inputs = [],
    onStateChange,
  } = options
  let rive: Rive | null = null
  let loaded = false

  onMounted(_onMounted)
  onUnmounted(_onUnmount)

  return {
    /**
     * ### Returns an input object for controlling the Rive animation programmatically.
     *
     * #### Usage:
     * ```ts
     * const input = await getInput('inputName');
     * input.value = 1; // Set a number input
     * input.fire(); // Fire a trigger input
     * ```
     */
    getInput,
    getInstance: () => rive,
  }

  async function getInput(name: I[number]['name']) {
    const _rive = await new Promise<Rive>((resolve) => {
      const interval = setInterval(() => {
        if (loaded && rive) {
          clearInterval(interval)
          resolve(rive)
        }
      }, 100)
    })
    return getInputsObjects(_rive)[name]
  }

  function _onMounted() {
    if (!canvasRef.value) {
      return
    }

    rive = new Rive({
      src,
      canvas: canvasRef.value,
      stateMachines: stateMachineName,
      autoplay,
      autoBind,
      onLoad,
      onStateChange,
    })

    const debouncedOnResize = useDebounceFn(onResize, 100)

    useEventListener(window, 'resize', debouncedOnResize)
  }

  function _onUnmount() {
    if (rive) {
      rive?.cleanup()
    }
  }

  function getInputsObjects(rive: Rive) {
    return inputs.reduce(
      (acc, { name }) => {
        const inputs = rive?.stateMachineInputs(stateMachineName)
        const input = inputs?.find((input) => input.name === name)
        if (input) {
          acc[name as I[number]['name']] = input
        }
        return acc
      },
      {} as Record<I[number]['name'], StateMachineInput>,
    )
  }

  function onResize() {
    if (rive) {
      rive.resizeDrawingSurfaceToCanvas()
    }
  }

  function onLoad() {
    if (!rive) {
      return
    }
    loaded = true
    rive.resizeDrawingSurfaceToCanvas()
    const inputsObject = getInputsObjects(rive)
    const entries = Object.entries(inputsObject) as Array<[string, StateMachineInput]>

    entries.forEach(([inputName, input]) => {
      const userInput = inputs.find((input) => input.name === inputName)

      if (userInput) {
        switch (userInput.type) {
          case StateMachineInputType.Number:
            input.value = Number(userInput.defaultValue) ?? 0
            break
          case StateMachineInputType.Boolean:
            input.value = !!(userInput.defaultValue ?? 0)
            break
          case StateMachineInputType.Trigger:
            if (userInput.defaultValue) {
              input.fire()
            }
            break
        }
      }
    })
    options.onLoad?.(rive)
  }
}

// region Types

interface StrictInput {
  readonly name: string
  readonly type: StateMachineInputType
  readonly defaultValue?: number | boolean | string
}

interface UseRiveOption<I extends ReadonlyArray<StrictInput>> {
  canvasRef: Ref<HTMLCanvasElement | null>
  src: string
  autoplay?: boolean
  autoBind?: boolean
  stateMachineName?: string
  inputs?: I
  onLoad?: (rive: Rive) => void
  onStateChange?: EventCallback
}

// endregion
