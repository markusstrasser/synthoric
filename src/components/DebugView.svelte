<script>
  import actions from '$stores/index.svelte'

  const { showFilteredOnly = true } = $props() // New prop to control which actions to display

  const userActions = $derived(actions)
  $inspect(actions)

  const icons = {
    init: '🚀',
    multipleChoiceAnswer: '🔘',
    'text-input': '✏️',
    'button-click': '👆',
  }

  function formatTimestamp(ts) {
    return new Date(ts).toLocaleTimeString()
  }

  // Determine which actions to display based on the prop
  const displayedActions = $derived(
    showFilteredOnly ? userActions.filteredUserActions : userActions.userActions
  )
</script>

<div class="p-2 bg-gray-100 text-xs">
  <div class="flex justify-between items-center mb-2">
    <h1 class="text-sm font-bold">Debug View</h1>
    <div class="text-gray-600">
      Actions: {displayedActions.length} | Submitted: {userActions.hasSubmitted ? '✅' : '❌'}
    </div>
  </div>

  <h2 class="font-semibold mb-1">
    {showFilteredOnly ? 'Filtered Actions' : 'All Actions'}
  </h2>
  <ul class="space-y-1">
    {#each displayedActions as action}
      <li class="bg-white p-1 rounded text-[10px] flex items-start">
        <span class="mr-1">{icons[action.type] || '❓'}</span>
        <div class="flex-grow overflow-hidden">
          <div class="flex justify-between">
            <span class="font-medium">{action.type}</span>
            <span class="text-gray-500">{formatTimestamp(action.timestamp)}</span>
          </div>
          {#if action.value}
            <pre class="truncate">{JSON.stringify(action.value)}</pre>
          {/if}
        </div>
      </li>
    {/each}
  </ul>
</div>
