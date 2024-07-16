<script lang="ts">
  import { enhance } from '$app/forms'
  import { goto } from '$app/navigation'
  import SequencePreviewCard from '$components/SequencePreviewCard.svelte'
  import { api } from '$convex/_generated/api.js'
  import { useQuery } from 'convex-svelte'
  import { fly } from 'svelte/transition'

  const { form } = $props()
  const query = useQuery(api.sequences.getLatestK, { k: 3 })
  let isGenerating = $state(false)

  $effect(() => {
    if (form?.error) {
      // TODO: display toast or error message
    }
  })

  const handleSequenceClick = seq => goto(`/seq/${seq.index}/${seq.interactions.length}`)

  const handleSubmit = () => {
    isGenerating = true
    return async ({ update }) => {
      isGenerating = false
      await update()
    }
  }
</script>

<svelte:head>
  <title>Home | Synth</title>
  <meta name="description" content="Synth - AI-driven STEM learning platform" />
</svelte:head>

<section class="space-y-8">
  <h1 class="text-4xl font-bold text-center text-shadow">Welcome to Synth</h1>
  <p class="text-xl text-center text-gray-600">Discover and explore learning sequences:</p>

  {#if query.isLoading}
    <p class="text-center text-gray-500">Loading sequences...</p>
  {:else if query.error}
    <p class="text-center text-red-500">Failed to load: {query.error.toString()}</p>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each query.data as sequence, index}
        <div in:fly={{ y: 20, delay: index * 100 }}>
          <SequencePreviewCard {...sequence} onClick={() => handleSequenceClick(sequence)} />
        </div>
      {/each}
    </div>
  {/if}

  <div class="mt-8 text-center">
    {#if form?.error}
      <h2 class="text-red-500 mb-2">{form.error}</h2>
    {/if}
    <form method="post" use:enhance={handleSubmit}>
      <button type="submit" class="btn btn-primary" disabled={query.isLoading || isGenerating}>
        {query.isLoading ? 'Loading...' : isGenerating ? 'Generating...' : 'Generate New Sequences'}
      </button>
    </form>
  </div>
</section>
