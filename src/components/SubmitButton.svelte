<script lang="ts">
  import { addUserAction } from '$lib/stores/index'

  const { id = '' } = $props()

  const handleSubmit = () =>
    addUserAction({
      type: 'button-click',
      id,
      isSubmit: true,
      value: 'submit',
    })
</script>

<button
  onclick={handleSubmit}
  class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors"
>
  Submit
</button>
