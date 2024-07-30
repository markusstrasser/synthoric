<script lang="ts">
  import actions from '$stores/index.svelte'
  import Markdown from '$components/Markdown.svelte'
  import { fade } from 'svelte/transition'
  import {
    Button,
    Card,
    Dialog,
    DropdownMenu,
    Input,
    Label,
    Select,
    Table,
    Tabs,
    Tooltip,
    Form,
  } from '$components/ui/button'

  const { dispatch } = $props() //equivalent to Svelte 4 'export let dispatch'

  /* Svelte 5 with runesexamples
  const somelist = $state([]) //equivalent to Svelte 4 'let somelist'
  const listLength = $derived(somelist?.length || 0)
  const listLength2 = $derived.by(somelist, (list) => list?.length || 0

  $effect(() => {
    //this will track changes run every time listLength changes
    console.log(listLength)
    dispatch({type: 'list-length', payload: listLength})
  })

  */
  //Your code below ...  ->
</script>

<Button>Click me</Button>
