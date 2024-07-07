// actions.ts
import { addUserAction } from '$stores/index.svelte'

export function userAction(node: HTMLElement, { type, id }: { type: string; id: string }) {
  const handleAction = (event: Event) => {
    addUserAction({
      type,
      id,
      value: (event.target as HTMLInputElement).value,
    })
  }

  node.addEventListener('change', handleAction)

  return {
    destroy() {
      node.removeEventListener('change', handleAction)
    },
  }
}
