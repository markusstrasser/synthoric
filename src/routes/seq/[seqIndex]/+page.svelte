<script lang="ts">
  import { page } from '$app/stores'

  $: ({ seqIndex } = $page.params)
</script>

<div>Sequence Overview: {seqIndex}</div>

<a href="/seq/{seqIndex}/0">Go to first interaction</a>

<p>TODO: sequence summary and sequence card (interaction summaries/cards expand on click)</p>
