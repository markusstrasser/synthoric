<script lang="ts">
  import Markdown from '$components/core/Markdown.svelte'
  import type { UserAction } from '$lib/types'

  const {
    choices,
    isCorrect,
    isReadOnly = false,
    onSelect,
  } = $props<{
    choices: string[]
    isCorrect?: boolean[]
    isReadOnly?: boolean
    onSelect: (action: UserAction) => void
  }>()

  let selectedIndex = $state<number | null>(null)

  function handleChoice(index: number) {
    if (isReadOnly) return
    selectedIndex = index
    onSelect({ choice: choices[index], isCorrect: isCorrect?.[index] })
  }
</script>

<div class="grid grid-cols-1 gap-4">
  {#each choices as choice, index (choice)}
    <label class="flex items-center space-x-2">
      <input
        type="radio"
        value={index}
        checked={selectedIndex === index}
        onchange={() => handleChoice(index)}
        disabled={isReadOnly}
      />
      <Markdown content={choice} />
      <!-- {#if isCorrect !== undefined && selectedIndex === index}
        <span>{isCorrect[index] ? '✓' : '✗'}</span>
      {/if} -->
    </label>
  {/each}
</div>
