<script lang="ts">
  import { fade } from 'svelte/transition'

  interface GridItem {
    id: string
    content: string
    row: number
    col: number
  }

  let {
    items = [],
    rows = 3,
    cols = 3,
    rowLabels = [],
    colLabels = [],
    onSelect = (selectedIds: string[]) => {},
  } = $props<{
    items: GridItem[]
    rows: number
    cols: number
    rowLabels: string[]
    colLabels: string[]
    onSelect: (selectedIds: string[]) => void
  }>()

  let selectedItems = $state<string[]>([])

  const toggleItem = (id: string) => {
    selectedItems = selectedItems.includes(id)
      ? selectedItems.filter(itemId => itemId !== id)
      : [...selectedItems, id]
    onSelect(selectedItems)
  }

  $inspect(selectedItems)
  // $effect(() => {
  //   console.log('Selected items:', selectedItems)
  // })

  const getItemAtPosition = (row: number, col: number) =>
    items.find(item => item.row === row && item.col === col)
</script>

<div class="grid gap-2" style="grid-template-columns: auto repeat({cols}, minmax(100px, 1fr));">
  <!-- Column labels -->
  <div></div>
  {#each colLabels as label}
    <div class="rounded bg-gray-100 p-2 text-center font-bold">{label}</div>
  {/each}

  <!-- Grid items -->
  {#each Array(rows) as _, rowIndex}
    <div class="flex items-center justify-end pr-2 font-bold">{rowLabels[rowIndex] || ''}</div>
    {#each Array(cols) as _, colIndex}
      {@const item = getItemAtPosition(rowIndex, colIndex)}
      {#if item}
        <button
          class="rounded border p-2 text-sm transition-all duration-200 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
          class:bg-blue-200={selectedItems.includes(item.id)}
          onclick={() => toggleItem(item.id)}
          transition:fade
        >
          {item.content}
        </button>
      {:else}
        <div class="rounded border bg-gray-50 p-2"></div>
      {/if}
    {/each}
  {/each}
</div>

<div class="mt-4 flex items-center justify-between">
  <p class="text-sm text-gray-600">Selected: {selectedItems.length}</p>
  <button
    class="rounded bg-blue-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-600"
    onclick={() => onSelect(selectedItems)}
  >
    Submit Selection
  </button>
</div>
