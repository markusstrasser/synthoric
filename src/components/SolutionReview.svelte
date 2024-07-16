<script lang="ts">
  import { nanoid } from 'nanoid'
  import SvelteMarkdown from 'svelte-markdown'
  import { addUserAction } from '$stores/index.svelte'
  import { slide } from 'svelte/transition'

  const { highLevelSketch, conceptualExplanation = null, stepsNested } = $props()

  let selectedStep: string | null = $state(null)
  const id = nanoid(4)

  function handleStepClick(step: string) {
    selectedStep = selectedStep === step ? null : step
    addUserAction({ type: 'selected-solution-step', id, value: step })
  }
</script>

<section class="card p-6 space-y-6">
  <h3 class="text-2xl font-bold mb-4">Solution Review</h3>

  <div class="space-y-4">
    <div>
      <h4 class="text-lg font-semibold mb-2">High-Level Sketch</h4>
      <div class="prose prose-sm max-w-none">
        <SvelteMarkdown source={highLevelSketch} />
      </div>
    </div>

    {#if conceptualExplanation}
      <div>
        <h4 class="text-lg font-semibold mb-2">Conceptual Explanation</h4>
        <div class="prose prose-sm max-w-none">
          <SvelteMarkdown source={conceptualExplanation} />
        </div>
      </div>
    {/if}

    <div>
      <h4 class="text-lg font-semibold mb-2">Step-by-Step Solution</h4>
      <ol class="space-y-4">
        {#each stepsNested as step (step.step)}
          <li>
            <button
              class="w-full text-left p-2 rounded-md transition-colors duration-300"
              class:bg-blue-100={selectedStep === step.step}
              class:hover:bg-gray-100={selectedStep !== step.step}
              on:click={() => handleStepClick(step.step)}
            >
              <div class="prose prose-sm max-w-none">
                <SvelteMarkdown source={step.step} />
              </div>
            </button>
            {#if selectedStep === step.step}
              <ul class="mt-2 space-y-2 pl-4" transition:slide>
                {#each step.subSteps as subStep (subStep.title)}
                  <li class="border-l-2 border-gray-300 pl-2">
                    <div class="prose prose-sm max-w-none">
                      <SvelteMarkdown source={subStep.title} />
                    </div>
                  </li>
                {/each}
              </ul>
            {/if}
          </li>
        {/each}
      </ol>
    </div>
  </div>
</section>
