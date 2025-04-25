import { readonly, ref } from 'vue'

const state = ref(false)
/**
 * @description
 * This composable is used to manage the global loading state of the application.
 * It provides methods to show, hide, and toggle the loading state.
 *
 * @example
 * const { isLoading, show, hide, toggle } = useGlobalLoading()
 *
 * // Show the loading overlay
 * show()
 *
 * // Hide the loading overlay
 * hide()
 *
 * // Toggle the loading overlay
 * toggle()
 */
export function useGlobalLoading() {
  /** Turn the overlay on */
  const show = () => (state.value = true)
  /** Turn the overlay off */
  const hide = () => (state.value = false)
  /** Optional toggle */
  const toggle = (forced?: boolean) =>
    (state.value = typeof forced === 'boolean' ? forced : !state.value)

  return {
    // readonly avoids accidental mutations
    isLoading: readonly(state),
    show,
    hide,
    toggle,
  }
}
