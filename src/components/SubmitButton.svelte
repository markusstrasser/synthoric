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
  class="mt-2 px-4 py-2 rounded-md cursor-pointer transition-colors
    {disabled
    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
    : 'bg-blue-500 text-white hover:bg-blue-600'}"
>
  Submit
</button>
