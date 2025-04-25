import { useTimeoutFn } from '@vueuse/core'

/**
 * ### Wait for a specified amount of time asynchronously
 *
 * ```ts
 * const { wait } = useWaitTimeAsync(1000)
 *
 */
export function useWaitTime(milliseconds: number) {
  return new Promise((resolve) => useTimeoutFn(resolve, milliseconds).start())
}
