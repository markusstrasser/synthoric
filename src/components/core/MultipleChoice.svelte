<script lang="ts">
  let {
    choices,
    isCorrect,
    id = crypto.randomUUID(),
    isReadOnly = false,
    onSelect,
    selectedIndex = $bindable<number | null>(null),
  } = $props<{
    choices: string[]
    isCorrect?: boolean[]
    id?: string
    isReadOnly?: boolean
    onSelect: (choice: string, index: number) => void
  }>()

  // let selectedIndex = $state<number | null>(null)

  const selectedChoice = $derived(selectedIndex !== null ? choices[selectedIndex] : null)
  const isAnswered = $derived(selectedIndex !== null)

  $effect(() => {
    if (selectedIndex !== null) {
      onSelect(selectedChoice, selectedIndex)
    }
  })

  function handleChoice(index: number) {
    if (!isReadOnly) {
      selectedIndex = index
    }
  }
</script>

{#snippet choiceItem(choice: string, index: number)}
  {@const isSelected = selectedIndex === index}
  {@const isCorrectAnswer = isCorrect?.[index]}
  <label
    class="flex items-center space-x-2 rounded-md p-2 transition-colors"
    class:bg-gray-100={isSelected}
    class:cursor-not-allowed={isReadOnly}
  >
    <input
      type="radio"
      {id}
      value={index}
      bind:group={selectedIndex}
      disabled={isReadOnly}
      onclick={() => handleChoice(index)}
    />
    <span>{choice}</span>
    {#if isAnswered && isSelected}
      <span class:text-green-500={isCorrectAnswer} class:text-red-500={!isCorrectAnswer}>
        {isCorrectAnswer ? '✓' : '✗'}
      </span>
    {/if}
  </label>
{/snippet}

<div class="grid grid-cols-1 gap-4">
  {#each choices as choice, index (choice)}
    {@render choiceItem(choice, index)}
  {/each}
</div>
