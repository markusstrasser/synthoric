  <script lang="ts">
  
  import { page } from '$app/stores';
  
  let params: Record<string, string> = {};
  $: params = $page.params;
  </script>
  
  <h1>Interaction in the sequence</h1>
  
  <h3>All Parameters:</h3>
  {#each Object.entries(params) as [key, value]}
    <p>{key}: {value}</p>
  {/each}
