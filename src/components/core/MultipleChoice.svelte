<script lang="ts">
  import Markdown from '$components/core/Markdown.svelte'

  let {
    choices,
    isCorrect,
    isReadOnly = false,
    onSelect,
    selectedIndex = $bindable<number | null>(null),
  } = $props<{
    choices: string[]
    isCorrect?: boolean[]
    isReadOnly?: boolean
    onSelect: (choice: string, index: number) => void
  }>()

  const selectedChoice = $derived(selectedIndex !== null ? choices[selectedIndex] : null)

  $effect(() => {
    onSelect(selectedChoice, selectedIndex)
  })

  function handleChoice(index: number) {
    if (isReadOnly) return
    selectedIndex = index
  }
</script>

{#snippet choiceItem(choice: string, index: number)}
  {@const isSelected = selectedIndex === index}
  <label
    class="flex items-center space-x-2 rounded-md p-2 transition-colors"
    class:bg-gray-100={isSelected}
    class:cursor-not-allowed={isReadOnly}
  >
    <input
      type="radio"
      value={index}
      bind:group={selectedIndex}
      disabled={isReadOnly}
      onclick={() => handleChoice(index)}
    />
    <Markdown content={choice} />
    <!-- {#if isAnswered && isSelected}
      <span class:text-green-500={isCorrectAnswer} class:text-red-500={!isCorrectAnswer}>
        {isCorrectAnswer ? '✓' : '✗'}
      </span>
    {/if} -->
  </label>
{/snippet}

<div class="grid grid-cols-1 gap-4">
  {#each choices as choice, index (choice)}
    {@render choiceItem(choice, index)}
  {/each}
  <button onclick={() => (selectedIndex = null)}>UnSelect</button>
</div>
