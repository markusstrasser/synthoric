<script lang="ts">
  //TODO: show if illegal visit: show "go back to seq or the last interaction index of the sequence that exist in DB"
  import { page } from '$app/stores'
  import { addUserAction } from '$lib/stores'

  let params: Record<string, string> = {}
  $: params = $page.params
  const submitAnswer = () => {
    console.log('submitAnswer')
    addUserAction({ value: 'hi' })

    //TODO: dispatch action {isFinal: true}
  }

  function pushFinal(node, params = {}) {
    console.log(node, 'node')
    node.addEventListener('click', () => {
      console.log('submitting action')
      addUserAction({ value: 'hi' })
    })
    return {
      update() {
        console.log('in update')
      },

      destroy() {
        //
      },
    }
  }
</script>

<h1>Interaction in the sequence</h1>

<h3>All Parameters:</h3>
{#each Object.entries(params) as [key, value]}
  <p>{key}: {value}</p>
{/each}

<!-- If on first index : go back to /seq -->
<!-- If on n index: go back to seq/n-1 -->
<!-- -->

<!-- const actions = {
  onclick,
  onSelectedText: text to store,
  onDrag,
} -->

<!-- <div use:captureUserActions("onSelectText", {value: "selectedText"})>TASK: DO A</div> -->
<div>SOLUTION (**hidden** until review-flow is done)</div>
<!-- <button onclick={submitAnswer}> SUBMIT ANSWER </button> -->
<button use:pushFinal>Submit</button>
<div>Review, Remediation (wait for AI to review Submission)</div>
<a href="">Go back</a>
<a href=""> Next (display on review-flow done) -: Upload to DB -: Run inference on db.history</a>
