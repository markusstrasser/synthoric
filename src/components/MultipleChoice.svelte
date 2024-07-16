<script lang="ts">
  import { nanoid } from 'nanoid'
  import { addUserAction } from '$stores/index.svelte'

  const { choices, isCorrect, isReadOnly = false } = $props()

  const id = nanoid(4)
  let selectedIndex = $state<number | null>(null)

  function handleChoice(index: number) {
    if (isReadOnly) return
    selectedIndex = index
    addUserAction({
      type: 'multipleChoiceAnswer',
      id,
      value: { choice: choices[index], isCorrect: isCorrect?.[index] },
    })
  }
</script>

<div class="grid grid-cols-1 gap-4">
  {#each choices as choice, index (choice)}
    <label class="flex items-center space-x-2">
      <input
        type="radio"
        name={`choice-${id}`}
        value={index}
        checked={selectedIndex === index}
        onchange={() => handleChoice(index)}
        disabled={isReadOnly}
      />
      <span>{choice}</span>
      {#if isCorrect !== undefined && selectedIndex === index}
        <span>{isCorrect[index] ? '✓' : '✗'}</span>
      {/if}
    </label>
  {/each}
</div>
