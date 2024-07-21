<!-- 
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";

export default function Markdown({ children }) {
  //! newline is {"  "} two spaces ... jfc

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]} //!needs remarkMath AND KATEX apparently
      rehypePlugins={[rehypeKatex]}
    >
      {children}
    </ReactMarkdown>
  );
} -->
<script lang="ts">
  import Markdown from 'svelte-markdown'

  const { text } = $props()
</script>

<Markdown source={text} />
