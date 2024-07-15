<script lang="ts">
  import { enhance } from '$app/forms'
  import { goto } from '$app/navigation'
  import SequencePreviewCard from '$components/SequencePreviewCard.svelte'
  import { api } from '$convex/_generated/api.js'
  import { useQuery } from 'convex-svelte'

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
  <title>Home</title>
  <meta name="description" content="Synth" />
</svelte:head>

<section class="p-4">
  <h1 class="text-2xl font-bold mb-4">Synth</h1>
  <p>Available Sequences:</p>

  {#if query.isLoading}
    <p>Loading...</p>
  {:else if query.error}
    <p class="text-red-500">Failed to load: {query.error.toString()}</p>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each query.data as sequence}
        <SequencePreviewCard {...sequence} onClick={() => handleSequenceClick(sequence)} />
      {/each}
    </div>
  {/if}

  <div class="mt-4">
    {#if form?.error}
      <h2 class="text-red-500 mb-2">{form.error}</h2>
    {/if}
    <form method="post" use:enhance={handleSubmit}>
      <button
        type="submit"
        class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
        disabled={query.isLoading || isGenerating}
      >
        {query.isLoading ? 'Loading...' : isGenerating ? 'Generating...' : 'Generate New Sequences'}
      </button>
    </form>
  </div>
</section>
