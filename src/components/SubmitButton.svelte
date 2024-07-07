<script lang="ts">
  import { addUserAction } from '$stores/index.svelte.ts'

  const { id = '' } = $props()

  const handleSubmit = () =>
    addUserAction({
      type: 'button-click',
      id,
      hasSubmitted: true,
      value: 'submit',
    })
</script>

<button
  onclick={handleSubmit}
  class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors"
>
  Submit
</button>
