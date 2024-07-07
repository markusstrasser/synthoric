<script lang="ts">
  import { onDestroy } from 'svelte'
  import TextInput from '$components/TextInput.svelte'
  import Button from '$components/SubmitButton.svelte'
  import store from '$lib/stores'
  import Test from '$components/Test.svelte'

  let userActions: any[] = []

  const unsubscribe = store.subscribe(({ userActions: actions }) => {
    userActions = actions
  })

  onDestroy(unsubscribe)
</script>

<Test />
