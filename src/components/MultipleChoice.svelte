<script lang="ts">
  import { nanoid } from 'nanoid'
  import { addUserAction } from '$stores/index.svelte.ts'

  const { interaction, isReadOnly = false } = $props()

  const id = nanoid(4)
  const { choices, isCorrect, task } = interaction

  function handleChoice(choice: string, index: number) {
    addUserAction({
      type: 'multipleChoiceAnswer',
      id,
      value: { choice, isCorrect: isCorrect[index] },
    })
  }
</script>

<div class="grid grid-cols-1 gap-4">
  <p>{task}</p>
  {#each choices as choice, index (choice)}
    <button
      class="w-full py-2 px-4 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      onclick={() => handleChoice(choice, index)}
      disabled={isReadOnly}
    >
      {choice}
    </button>
  {/each}
  <hr class="my-4" />
</div>
