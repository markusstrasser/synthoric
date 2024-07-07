<script lang="ts">
  import { onDestroy } from 'svelte'
  import TextInput from '$components/TextInput.svelte'
  import Button from '$components/SubmitButton.svelte'
  import store from '$lib/stores'

  let userActions: any[] = []

  const unsubscribe = store.subscribe(({ userActions: actions }) => {
    userActions = actions
  })

  onDestroy(unsubscribe)
</script>

<div>
  <TextInput id="example-input" placeholder="Enter text here" />
  <Button id="submit-button" />
</div>

<div>
  <h3>Current Actions:</h3>
  <pre>{JSON.stringify(userActions, null, 2)}</pre>
</div>
