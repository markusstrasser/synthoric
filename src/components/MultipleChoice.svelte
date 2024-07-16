<script lang="ts">
  import { nanoid } from 'nanoid'
  import { addUserAction } from '$stores/index.svelte'

  let { choices, isCorrect, isReadOnly = false } = $props()

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
    <div>
      <input
        type="radio"
        id={`choice-${id}-${index}`}
        name={`choice-${id}`}
        value={index}
        checked={selectedIndex === index}
        onchange={() => handleChoice(index)}
        disabled={isReadOnly}
      />
      <label for={`choice-${id}-${index}`}>{choice}</label>
      {#if isCorrect !== undefined && selectedIndex === index}
        <span class="ml-2">{isCorrect[index] ? '✓' : '✗'}</span>
      {/if}
    </div>
  {/each}
</div>
