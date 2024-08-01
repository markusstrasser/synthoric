<script lang="ts">
  import type { Snippet } from 'svelte'

  let {
    children,
    dropDownList,
  }: {
    children: Snippet
    dropDownList: Snippet
  } = $props()

  let isOpen = $state(false)

  function toggleDropdown() {
    isOpen = !isOpen
  }

  function closeDropdown() {
    isOpen = false
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="dropdown" onmouseleave={closeDropdown}>
  <div
    tabindex="0"
    role="button"
    onclick={toggleDropdown}
    onkeydown={e => e.key === 'Enter' && toggleDropdown()}
  >
    {@render children()}
  </div>

  {#if isOpen}
    <ul class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
      {@render dropDownList()}
    </ul>
  {/if}
</div>
