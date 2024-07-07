<script lang="ts">
  import { mockExercise } from '$lib/mocks'
  import { onDestroy } from 'svelte'
  import TextInput from '$components/TextInput.svelte'
  import Button from '$components/SubmitButton.svelte'
  import Test from '$components/Test.svelte'
  import ExerciseWithTextInput from '$components/ExerciseWithTextInput.svelte'
  import SubmitButton from '$components/SubmitButton.svelte'
  import store from '$stores'
</script>

<!-- <Test /> -->

<ExerciseWithTextInput interaction={mockExercise}>
  <SubmitButton />
</ExerciseWithTextInput>
<div>
  {JSON.stringify($store)}
</div>
