<script lang="ts">
  import actions from '$stores/index.svelte'

  const { showFilteredOnly = true, title = 'Debug View' } = $props()

  const userActions = $derived(actions)
  const debugInfo = $derived(actions.debugInfo)

  $inspect(userActions)

  const icons = {
    init: '🚀',
    multipleChoiceAnswer: '🔘',
    'text-input': '✏️',
    'button-click': '👆',
    OK: '✅',
    NEW_INTERACTION: '🆕',
    SEQUENCE_NOT_FOUND: '❓',
    INTERACTION_OUT_OF_BOUNDS: '⚠️',
    INTERACTION_NOT_FOUND: '🚫',
    true: '✅',
    false: '❌',
  }

  function formatTimestamp(ts) {
    return new Date(ts).toLocaleTimeString()
  }

  function formatValue(value: any): string {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value)
    }
    return String(value)
  }

  const displayedActions = $derived(
    showFilteredOnly ? userActions.filteredUserActions : userActions.userActions
  )
</script>

<div class="p-2 bg-gray-100 text-xs">
  <div class="flex justify-between items-center mb-2">
    <h1 class="text-sm font-bold">{title}</h1>
    <div class="text-gray-600">
      Actions: {displayedActions.length} | Submitted: {userActions.hasSubmitted ? '✅' : '❌'}
    </div>
  </div>

  {#if debugInfo}
    <h2 class="font-semibold mb-1">General Debug Info</h2>
    <ul class="space-y-1 mb-4">
      {#each Object.entries(debugInfo) as [key, value]}
        <li class="bg-white p-1 rounded text-[10px] flex items-start">
          <span class="mr-1">{icons[value] || icons[key] || '❓'}</span>
          <div class="flex-grow overflow-hidden">
            <span class="font-medium">{key}:</span>
            <span class="ml-1">{formatValue(value)}</span>
          </div>
        </li>
      {/each}
    </ul>
  {/if}

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
