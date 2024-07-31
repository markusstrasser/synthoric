<script lang="ts">
  //TODO: use shadcn Input instead
  //TODO: derive input value from store1.filteredUserActions?
  let { id = '', placeholder = '', value = '', dispatch } = $props()

  function handleInput(event: Event) {
    value = (event.target as HTMLInputElement).value
    dispatch({
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
  class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
