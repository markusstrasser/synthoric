<script lang="ts">
  import { nanoid } from 'nanoid'
  import SvelteMarkdown from 'svelte-markdown'
  import { addUserAction } from '$stores'

  interface SubStep {
    title: string
  }

  interface Step {
    step: string
    subSteps: SubStep[]
  }

  const {
    highLevelSketch,
    conceptualExplanation = null,
    stepsNested,
  } = $props<{
    highLevelSketch: string
    conceptualExplanation?: string | null
    stepsNested: Step[]
  }>()

  let selectedStep: string | null = $state(null)
  const id = nanoid(4)

  function handleStepClick(step: string) {
    selectedStep = selectedStep === step ? null : step
    addUserAction({ type: 'selected-solution-step', id, value: step })
  }
</script>

<section class="p-4">
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900">Reflection on Student Exercise</h3>
    </div>
    <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
      <dl class="sm:divide-y sm:divide-gray-200">
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">High-Level Sketch</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <SvelteMarkdown source={highLevelSketch} />
          </dd>
        </div>
        {#if conceptualExplanation}
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Conceptual Explanation</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <SvelteMarkdown source={conceptualExplanation} />
            </dd>
          </div>
        {/if}
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Step-by-Step Solution</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <ol class="space-y-2">
              {#each stepsNested as step (step.step)}
                <li>
                  <div
                    role="button"
                    tabindex="0"
                    class="cursor-pointer rounded-md p-2 transition-all"
                    class:bg-blue-200={selectedStep === step.step}
                    class:hover:bg-gray-200={selectedStep !== step.step}
                    onclick={() => handleStepClick(step.step)}
                    onkeydown={e => e.key === 'Enter' && handleStepClick(step.step)}
                  >
                    <SvelteMarkdown source={step.step} />
                  </div>
                  <ul class="ml-4 mt-2 space-y-1">
                    {#each step.subSteps as subStep (subStep.title)}
                      <li>
                        <button
                          class="w-full text-left cursor-pointer border-l-2 border-gray-300 pl-2"
                          class:bg-blue-200={selectedStep === subStep.title}
                          class:hover:bg-gray-200={selectedStep !== subStep.title}
                          onclick={() => handleStepClick(subStep.title)}
                        >
                          <SvelteMarkdown source={subStep.title} />
                        </button>
                      </li>
                    {/each}
                  </ul>
                </li>
              {/each}
            </ol>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</section>
