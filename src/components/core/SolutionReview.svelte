<script lang="ts">
  import Markdown from './Markdown.svelte'

  type Step = {
    id: string
    content: string
    depth: number
  }

  let {
    title = 'Solution Review',
    sections = [],
    steps = [],
    onSelect = (id: string | null) => {},
  } = $props<{
    title?: string
    sections?: Array<{ title: string; content: string }>
    steps: Step[]
    onSelect?: (id: string | null) => void
  }>()

  let selectedStepId = $state<string | null>(null)

  function handleStepClick(stepId: string) {
    selectedStepId = selectedStepId === stepId ? null : stepId
    onSelect(selectedStepId)
  }
</script>

<section class="card space-y-6 p-6">
  <h3 class="mb-4 text-2xl font-bold">{title}</h3>

  <div class="space-y-6">
    {#each sections as section}
      <div>
        <h4 class="mb-2 text-lg font-semibold">{section.title}</h4>
        <div class="prose prose-sm max-w-none">
          <Markdown content={section.content} />
        </div>
      </div>
    {/each}

    {#if steps.length > 0}
      <div>
        <h4 class="mb-2 text-lg font-semibold">Step-by-Step Solution</h4>
        <ul class="space-y-2">
          {#each steps as step}
            <li style="padding-left: {step.depth * 1}rem;">
              <button
                class="w-full rounded-md p-2 text-left transition-colors duration-300"
                class:bg-blue-100={selectedStepId === step.id}
                class:hover:bg-gray-100={selectedStepId !== step.id}
                onclick={() => handleStepClick(step.id)}
              >
                <div class="prose prose-sm max-w-none">
                  <Markdown content={step.content} />
                </div>
              </button>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
</section>
