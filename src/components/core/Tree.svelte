<script>
  const { content } = $props()

  function TreeNode({ node }) {
    const hasChildren = node.children && node.children.length > 0
    return {
      name: node.name,
      hasChildren,
      children: hasChildren ? node.children : [],
    }
  }
</script>

<ul class="pl-0">
  {#each content as node (node.id)}
    {@const { name, hasChildren, children } = TreeNode({ node })}
    <li class="list-none">
      <div class="cursor-pointer rounded px-2 py-1 hover:bg-gray-100">
        {name}
      </div>
      {#if hasChildren}
        <ul class="pl-4">
          {#each children as child (child.id)}
            <svelte:self content={[child]} />
          {/each}
        </ul>
      {/if}
    </li>
  {/each}
</ul>
