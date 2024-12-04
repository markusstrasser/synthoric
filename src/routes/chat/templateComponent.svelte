<script lang="ts">
  //Custom components
  import SolutionReview from '$components/core/SolutionReview.svelte'
  import Tree from '$components/core/Tree.svelte'
  // import Markdown from '$components/core/Markdown.svelte'
  // import Markdown from 'svelte-exmarkdown'

  import 'katex/dist/katex.css'
  import '@cartamd/plugin-tikz/fonts.css'
  // import '@cartamd/plugin-slash/default.css'
  import '@cartamd/plugin-emoji/default.css'
  import '@cartamd/plugin-code/default.css'

  import { gfmPlugin } from 'svelte-exmarkdown/gfm'
  import remarkMath from 'remark-math'
  import rehypeKatex from 'rehype-katex'
  import remarkGfm from 'remark-gfm'
  import type { Plugin } from 'svelte-exmarkdown'

  import rehypeRaw from 'rehype-raw'

  let md = $state('**b** *c*$$\n\\int_0^\\infty x^2 dx\n$$')
  // const plugins = [rehypeKatex, remarkGfm]
  const plugins: Plugin[] = [{ rehypePlugin: [rehypeKatex] }, gfmPlugin()]

  //Libraries
  import P5 from 'p5-svelte'
  // import type { Sketch } from 'p5-svelte'
  import * as d3 from 'd3'

  import actions from '$stores/index.svelte'
  import 'carta-md/default.css' /* Default theme */
  import { createDispatch, dispatch } from '$stores/index.svelte'

  import { Carta, Markdown, MarkdownEditor } from 'carta-md'

  import { math } from '@cartamd/plugin-math'
  import DOMPurify from 'isomorphic-dompurify'

  const carta = new Carta({
    sanitizer: DOMPurify.sanitize,
    extensions: [math()],
  })

  let value = `And then $ a + b = cc $ this plem
   $\n\\int_0^\\infty x^2 dx\n$
  `

  //Your code and svelte html/markup + tailwind below ...  ->
</script>

<div>
  <!-- <MarkdownEditor {carta} /> -->
  <Markdown {carta} {value} />

  <!-- <textarea bind:value={md}></textarea> -->
  <!-- <Markdown {md} {plugins} /> -->
  <!-- <Markdown content={'Hello. $ A + B $ = C'} /> -->
</div>
