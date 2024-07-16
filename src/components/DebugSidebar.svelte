<script lang="ts">
  import { onMount } from 'svelte'
  import DebugView from './DebugView.svelte'

  let isOpen = $state(true)
  let activeTab = $state('general')

  const tabs = [
    { id: 'general', label: 'General', emoji: '📊' },
    { id: 'network', label: 'Network', emoji: '🌐' },
    { id: 'performance', label: 'Performance', emoji: '⚡' },
    { id: 'errors', label: 'Errors', emoji: '❗' },
  ]

  function toggleSidebar() {
    isOpen = !isOpen
  }

  function setActiveTab(tabId: string) {
    activeTab = tabId
  }
</script>

<div
  class="fixed top-0 right-0 h-full z-50 transition-all duration-300 ease-in-out bg-gray-100"
  class:w-80={isOpen}
  class:w-12={!isOpen}
>
  <button
    class="absolute top-4 left-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
    onclick={toggleSidebar}
  >
    {isOpen ? '▶️' : '◀️'}
  </button>

  {#if isOpen}
    <div class="pt-16 px-4">
      <h2 class="text-xl font-bold mb-4">Debug Panel</h2>

      <div class="flex mb-4 bg-white rounded-lg overflow-hidden">
        {#each tabs as tab}
          <button
            class="flex-1 py-2 px-3 text-sm transition-colors"
            class:bg-blue-500={activeTab === tab.id}
            class:text-white={activeTab === tab.id}
            class:hover:bg-gray-200={activeTab !== tab.id}
            onclick={() => setActiveTab(tab.id)}
          >
            <span class="mr-1">{tab.emoji}</span>
            {tab.label}
          </button>
        {/each}
      </div>

      <div class="bg-white rounded-lg p-4 shadow">
        {#if activeTab === 'general'}
          <DebugView />
        {:else if activeTab === 'network'}
          <p>Network debugging information goes here</p>
        {:else if activeTab === 'performance'}
          <p>Performance metrics go here</p>
        {:else if activeTab === 'errors'}
          <p>Error logs go here</p>
        {/if}
      </div>
    </div>
  {/if}
</div>
