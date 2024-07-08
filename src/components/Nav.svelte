<script>
  import Dropdown from './Dropdown.svelte'
</script>

<Dropdown>
  <div class="flex items-center avatar online">
    <div class="w-10 rounded-full">
      <!-- svelte-ignore a11y_missing_attribute -->
      <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
    </div>
  </div>

  {#snippet dropDownList()}
    <li>
      <a href="/profile" class="flex items-center gap-2 p-2 hover:bg-base-200">
        <i class="bi bi-person-fill"></i> Profile
      </a>
    </li>
    <li>
      <a href="/settings" class="flex items-center gap-2 p-2 hover:bg-base-200">
        <i class="bi bi-gear"></i> Settings
      </a>
    </li>
  {/snippet}
</Dropdown>
