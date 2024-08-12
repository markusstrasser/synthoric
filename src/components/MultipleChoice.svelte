<script lang="ts">
  import type { UserAction } from '$lib/types'
  import { nanoid } from 'nanoid'

  const {
    choices,
    isCorrect,
    id,
    isReadOnly = false,
    dispatch,
  } = $props<{
    choices: string[]
    isCorrect?: boolean[]
    isReadOnly?: boolean
    dispatch: (action: UserAction) => void
  }>()

  let selectedIndex = $state<number | null>(null)

  function handleChoice(index: number) {
    if (isReadOnly) return
    selectedIndex = index
    dispatch({
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
      <!-- {#if isCorrect !== undefined && selectedIndex === index}
        <span>{isCorrect[index] ? '✓' : '✗'}</span>
      {/if} -->
    </label>
  {/each}
</div>
