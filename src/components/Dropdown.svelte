<script lang="ts">
  import type { Snippet } from 'svelte'

  let {
    children,
    dropDownList,
  }: {
    children: Snippet
    dropDownList: Snippet
  } = $props()
</script>

<div class="dropdown dropdown-hover">
  <div tabindex="0" role="button">
    {@render children()}
  </div>

  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
    {@render dropDownList()}
  </ul>
</div>
