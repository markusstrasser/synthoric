<script lang="ts">
  export let data: { tagline: string; content: { question: string }[] }
  const { tagline, content } = data
</script>

<div>{tagline}</div>
<div>
  {#each content as { question }}
    <div>{question}</div>
  {/each}
</div>
