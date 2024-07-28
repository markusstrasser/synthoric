<script lang="ts">
  import { Button } from '$components/ui/button'
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

  const handleSequenceClick = seq =>
    goto(`/seq/${seq.index}/${Math.max(seq.interactions.length - 1, 0)}`)

  const handleSubmit = () => {
    isGenerating = true
    return async ({ update }) => {
      isGenerating = false
      await update()
    }
  }
</script>

<svelte:head>
  <title>Synthoric</title>
  <meta name="description" content="Synth - AI-driven STEM learning platform" />
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-8 font-serif">
  {#if query.isLoading}
    <div class="flex h-64 items-center justify-center">
      <div class="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
    </div>
  {:else if query.error}
    <div class="mb-8 border-l-4 border-red-500 bg-red-100 p-4 text-red-700" role="alert">
      <p class="font-bold">Error</p>
      <p>{query.error.toString()}</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
      {#each query.data as sequence, index}
        <div in:fly={{ y: 20, delay: index * 100 }} class="col-span-1 md:col-span-2">
          <SequencePreviewCard {...sequence} onClick={() => handleSequenceClick(sequence)} />
        </div>
      {/each}
    </div>
  {/if}

  <div class="mt-16 text-center">
    {#if form?.error}
      <div class="mb-8 border-l-4 border-red-500 bg-red-100 p-4 text-red-700" role="alert">
        <p class="font-bold">Error</p>
        <p>{form.error}</p>
      </div>
    {/if}
    <form method="post" use:enhance={handleSubmit}>
      <Button
        variant="outline"
        size="lg"
        type="submit"
        disabled={query.isLoading || isGenerating}
        class="font-serif"
      >
        {#if query.isLoading}
          Loading...
        {:else if isGenerating}
          Generating...
        {:else}
          Generate New Sequences
        {/if}
      </Button>
    </form>
    <form method="post" use:enhance={handleSubmit}>
      <input type="hidden" name="type" value="interleaved" />
      <Button
        variant="outline"
        size="lg"
        type="submit"
        disabled={query.isLoading || isGenerating}
        class="font-serif"
      >
        {#if query.isLoading}
          Loading...
        {:else if isGenerating}
          Generating...
        {:else}
          Generate context-aware *Interleaved* Sequences
        {/if}
      </Button>
    </form>
  </div>
</div>
