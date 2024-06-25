<script lang="ts">
  import { page } from '$app/stores';
  
  $: ({ id   } = $page.params);
</script>
  
  <h1>ID: {id}</h1>
  <p>TODO: sequence summary and sequence card (interaction summaries/cards expand on click)</p>
    