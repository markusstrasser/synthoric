<script lang="ts">
  import { createDispatch } from '$lib/stores/index.svelte'

  const { id = '', disabled = false } = $props()

  const dispatch = createDispatch({ type: 'button-click', id })
</script>

<button
  onclick={() =>
    dispatch({
      hasSubmitted: true,
      value: 'submit',
    })}
  {disabled}
  class="mt-2 cursor-pointer rounded-md px-4 py-2 transition-colors
    {disabled
    ? 'cursor-not-allowed bg-gray-400 text-gray-600'
    : 'bg-blue-500 text-white hover:bg-blue-600'}"
>
  Submit
</button>
