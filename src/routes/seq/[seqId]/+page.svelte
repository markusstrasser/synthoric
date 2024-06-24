<script lang="ts">
  import { page } from '$app/stores';
  
  $: ({ id, id2 } = $page.params);
  </script>
  
  <h1>ID: {id}</h1>
  <h2>ID2: {id2}</h2>