<script lang="ts">
  import { addUserAction } from '$stores/index.svelte.ts'

  //TODO: derive input value from store1.filteredUserActions?
  let { id = '', placeholder = '', value = '' } = $props()

  function handleInput(event: Event) {
    value = (event.target as HTMLInputElement).value
    addUserAction({
      type: 'text-input',
      id,
      value,
    })
  }
</script>

<input
  {id}
  {placeholder}
  {value}
  oninput={handleInput}
  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
