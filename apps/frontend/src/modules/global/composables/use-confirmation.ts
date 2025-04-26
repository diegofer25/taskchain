import type { Props as AppConfirmDialogProps } from '@/modules/global/components/app-interactions/AppConfirmDialog.vue'
import { reactive } from 'vue'

const confirmations = reactive<ConfirmOptions[]>([])

/**
 * @description
 * This composable is used to manage the confirmation dialogs in the application.
 * It provides a method to show a confirmation dialog and returns a promise that resolves to true or false.
 *
 * @example
 * const { confirm } = useConfirmation()
 *
 * const isConfirmed = await confirm({
 *   title: 'Are you sure?',
 *   message: 'This action cannot be undone.',
 *   onConfirm: () => console.log('Confirmed'),
 *   onCancel: () => console.log('Cancelled'),
 * })
 */
export function useConfirmation() {
  /**
   * Show a confirmation dialog
   * @param options - The options for the confirmation dialog
   * @returns A promise that resolves to true if the user confirms, or false if the user cancels
   */
  async function confirm(options: AppConfirmDialogProps) {
    const id = crypto.randomUUID()
    const isConfirmed = await new Promise((resolve) => {
      confirmations.push({
        ...options,
        id,
        closed: false,
        onConfirm: () => {
          resolve(true)
          removeAfterCloseAnimation(id)
        },
        onCancel: () => {
          resolve(false)
          removeAfterCloseAnimation(id)
        },
      })
    })
    return isConfirmed
  }
  function removeAfterCloseAnimation(id: string) {
    const index = confirmations.findIndex((c) => c.id === id)
    confirmations[index].closed = true
    if (index !== -1) {
      setTimeout(() => {
        confirmations.splice(index, 1)
      }, 300)
    }
  }
  return {
    confirmations,
    confirm,
  }
}

export interface ConfirmOptions extends AppConfirmDialogProps {
  id: string
  closed: boolean
  onConfirm: () => void
  onCancel: () => void
}
