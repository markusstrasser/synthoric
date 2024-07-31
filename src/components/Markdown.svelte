<script lang="ts">
  import Markdown from 'svelte-markdown'

  const { text } = $props()
</script>

<Markdown source={text} />

<!-- Scratchpad
    <
      remarkPlugins={[remarkGfm, remarkMath]} //!needs remarkMath AND KATEX apparently
      rehypePlugins={[rehypeKatex]}
    >
      {children}
    </>
-->
