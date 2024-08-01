<script lang="ts">
  import Dropdown from '$components/core/Dropdown.svelte'
  import { ActionState } from '$stores/index.svelte.ts'
  // import { mockInteraction } from '$lib/mocks'
  // import Interaction from '$components/Interaction.svelte'
  import actions from '$stores/index.svelte'
  import { createDispatch } from '$stores/index.svelte'
  import MultipleChoice from '$components/core/MultipleChoice.svelte'
  import * as DropdownMenu from '$components/ui/dropdown-menu'
  import * as Select from '$components/ui/select'
  import SolutionReview from '$components/core/SolutionReview.svelte'

  const dispatch = (...args) => console.log(args)

  function handleItemClick(item: string) {
    console.log(`Clicked on: ${item}`)
    // You can add more logic here based on which item was clicked
  }
  let selectedIndex = $state(null)
  let showMultipleChoice = $state(false)

  function toggleMultipleChoice() {
    showMultipleChoice = !showMultipleChoice
  }

  $effect(() => {
    console.log(selectedIndex)
  })

  // Updated mock data for SolutionReview
  const mockSolutionReviewData = {
    title: 'Advanced Algorithm Solution',
    sections: [
      {
        title: 'High-Level Sketch',
        content:
          'This is a high-level sketch of the solution, outlining the main approach and key components.',
      },
      {
        title: 'Conceptual Explanation',
        content:
          "Here's a conceptual explanation of the approach, detailing the underlying principles and strategies used.",
      },
    ],
    steps: [
      { id: 'step1', content: 'Step 1: Initialize the problem', depth: 0 },
      { id: 'step1.1', content: 'Define the input parameters', depth: 1 },
      { id: 'step1.2', content: 'Set up the initial state', depth: 1 },
      { id: 'step2', content: 'Step 2: Process the data', depth: 0 },
      { id: 'step2.1', content: 'Iterate through the input', depth: 1 },
      { id: 'step2.2', content: 'Apply the core algorithm', depth: 1 },
      { id: 'step2.2.1', content: 'Handle edge cases', depth: 2 },
      { id: 'step2.2.2', content: 'Optimize for performance', depth: 2 },
      { id: 'step3', content: 'Step 3: Finalize the solution', depth: 0 },
      { id: 'step3.1', content: 'Aggregate the results', depth: 1 },
      { id: 'step3.2', content: 'Format the output', depth: 1 },
    ],
  }

  function handleSolutionReviewSelect(stepId) {
    console.log('Selected step:', stepId)
  }
</script>

<button onclick={() => (actions.newSubmit = true)}>Submit</button>
<div>
  {JSON.stringify(actions)}
</div>
<div>submitted: {actions.newSubmit}</div>

<Dropdown>
  {#snippet children()}
    <button>Open Dropdown</button>
  {/snippet}

  {#snippet dropDownList()}
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/contact">Contact</a></li>
  {/snippet}
</Dropdown>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>Open New Menu</DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item on:click={() => handleItemClick('Profile')}>Profile</DropdownMenu.Item>
    <DropdownMenu.Item on:click={() => handleItemClick('Settings')}>Settings</DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item on:click={() => handleItemClick('Logout')}>Logout</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>

<button onclick={toggleMultipleChoice}>
  {showMultipleChoice ? 'Hide' : 'Show'} Multiple Choice Question
</button>

{#if showMultipleChoice}
  <MultipleChoice choices={['a', 'b', 'c']} onSelect={dispatch} bind:selectedIndex />
{:else}
  <p>Multiple choice question is hidden. Click the button above to reveal it.</p>
{/if}

<Select.Root>
  <Select.Trigger class="w-[180px]">
    <Select.Value placeholder="Select a fruit" />
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.Label>Fruits</Select.Label>
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="banana">Banana</Select.Item>
      <Select.Item value="blueberry">Blueberry</Select.Item>å
      <Select.Item value="grapes">Grapes</Select.Item>
      <Select.Item value="pineapple">Pineapple</Select.Item>
    </Select.Group>
  </Select.Content>
</Select.Root>

<SolutionReview
  title={mockSolutionReviewData.title}
  sections={mockSolutionReviewData.sections}
  steps={mockSolutionReviewData.steps}
  onSelect={handleSolutionReviewSelect}
/>

<!-- <Interaction interactionConfig={mockInteraction} /> -->
