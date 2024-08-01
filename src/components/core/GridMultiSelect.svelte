<script lang="ts">
  import { Button } from '$components/ui/button'
  import { Tooltip, TooltipContent, TooltipTrigger } from '$components/ui/tooltip'
  import SvelteMarkdown from 'svelte-markdown'

  interface GridItem {
    id: string
    content: string
    row: number
    col: number
  }

  export let items: GridItem[] = []
  export let rows: number = 3
  export let cols: number = 3
  export let rowLabels: string[] = []
  export let colLabels: string[] = []
  export let onSubmit: (selectedIds: string[]) => void = () => {}

  let selectedItems: string[] = []

  function toggleItem(id: string) {
    selectedItems = selectedItems.includes(id)
      ? selectedItems.filter(itemId => itemId !== id)
      : [...selectedItems, id]
  }

  function handleSubmit() {
    onSubmit(selectedItems)
  }

  $: selectedCount = selectedItems.length
  $: grid = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(null))

  $: {
    for (const item of items) {
      if (item.row >= 0 && item.row < rows && item.col >= 0 && item.col < cols) {
        grid[item.row][item.col] = item
      }
    }
  }
</script>

<div class="mx-auto max-w-4xl p-4">
  {#if colLabels.length > 0}
    <div class="mb-4 grid gap-4" style="grid-template-columns: auto repeat({cols}, 1fr)">
      <div></div>
      <!-- Empty cell for alignment -->
      {#each colLabels as label}
        <div class="text-center font-semibold">{label}</div>
      {/each}
    </div>
  {/if}

  <div class="grid gap-4" style="grid-template-columns: auto repeat({cols}, 1fr)">
    {#each grid as row, rowIndex}
      {#if rowLabels[rowIndex]}
        <div
          class="writing-vertical-rl flex rotate-180 transform items-center justify-center font-semibold"
        >
          {rowLabels[rowIndex]}
        </div>
      {:else}
        <div></div>
      {/if}
      {#each row as cell, colIndex}
        {#if cell}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={selectedItems.includes(cell.id) ? 'default' : 'outline'}
                class="flex h-32 flex-col items-center justify-center overflow-hidden p-2 text-sm"
                on:click={() => toggleItem(cell.id)}
              >
                <div class="max-h-full overflow-hidden">
                  <SvelteMarkdown source={cell.content} />
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <SvelteMarkdown source={cell.content} />
            </TooltipContent>
          </Tooltip>
        {:else}
          <div class="h-32 rounded-md bg-gray-100"></div>
        {/if}
      {/each}
    {/each}
  </div>

  <div class="mt-4 text-right">
    <span class="mr-4">Selected: {selectedCount}</span>
    <Button on:click={handleSubmit}>Submit Selection</Button>
  </div>
</div>

<style lang="postcss">
  .writing-vertical-rl {
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }
</style>
