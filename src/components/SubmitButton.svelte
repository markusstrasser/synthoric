<script lang="ts">
  import { addUserAction } from '$stores/index.svelte.ts'

  const { id = '', disabled = false } = $props()

  const handleSubmit = () =>
    addUserAction({
      type: 'button-click',
      id,
      hasSubmitted: true,
      value: 'submit',
    })
</script>

<button
  {disabled}
  onclick={handleSubmit}
  class="mt-2 cursor-pointer rounded-md px-4 py-2 transition-colors
    {disabled
    ? 'cursor-not-allowed bg-gray-400 text-gray-600'
    : 'bg-blue-500 text-white hover:bg-blue-600'}"
>
  Submit
</button>
