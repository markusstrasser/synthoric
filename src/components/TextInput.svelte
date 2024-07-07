<script lang="ts">
  import { addUserAction } from '$lib/stores/index'

  const { id = '', placeholder = '' } = $props()
  let value = $state('')

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
