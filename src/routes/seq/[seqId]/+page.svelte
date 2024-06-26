<script lang="ts">
  import { page } from '$app/stores'

  $: ({ seqId } = $page.params)
</script>

<div>Sequence Overview: {seqId}</div>

<a href="/seq/1/1">Go to first interaction</a>

<p>TODO: sequence summary and sequence card (interaction summaries/cards expand on click)</p>
