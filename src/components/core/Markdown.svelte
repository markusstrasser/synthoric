<script lang="ts">
  import Markdown from 'svelte-markdown'

  const { content } = $props()
</script>

<Markdown source={content} />

<!-- Scratchpad
    <
      remarkPlugins={[remarkGfm, remarkMath]} //!needs remarkMath AND KATEX apparently
      rehypePlugins={[rehypeKatex]}
    >
      {children}
    </>
-->
