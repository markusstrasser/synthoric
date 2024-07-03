<!-- TODO: 
  Check sessionStorage for sequencses 
  Button: VNew Varaiiants! ! 
  Sequence .svelte :
  * Onclick -> Db.createSequence( {seqIndex: collect().length})
  * -> action: () interactions[0:x] = genIxs(newSeqInteractionPrompt) go to /seq/seqIndex 

-->

<script lang="ts">
  import { localStore } from '$lib/stores/localStore.svelte'

  interface Sequence {
    tagline: string
    title: string
  }

  const sequences = localStore<Sequence[]>('sequences', [])
</script>

<button on:click={() => sequences.value.push({ tagline: 'abc' })}> Add Seq </button>
<div>
  {JSON.stringify(sequences.value)}
</div>
<button
  on:click={async () => {
    const res = await fetch('/api/sequences')
    const data = await res.json()
    console.log(data)
  }}
>
  Fetch Sequences
</button>
