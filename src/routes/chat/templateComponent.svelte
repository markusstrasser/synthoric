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
  import { tikz } from '@cartamd/plugin-tikz'
  import DOMPurify from 'isomorphic-dompurify'

  const carta = new Carta({
    sanitizer: html => DOMPurify.sanitize(html, { ADD_TAGS: ['div'], ADD_ATTR: ['type'] }),
    extensions: [math(), tikz({ debug: false, center: true })],
  })

  let value = `And then $ a + b = cc $ this plem
   $\n\\int_0^\\infty x^2 dx\n$
  `

  // Use String.raw to avoid escaping backslashes
  let value2 = String.raw`tikz
  \usepackage{circuitikz}

\begin{document}
  \begin{circuitikz} \draw
    (0,0) to[battery] (0,4)
    to[ammeter] (4,4) -- (4,0)
    to[lamp] (0,0)
    ;
  \end{circuitikz}
\end{document}`

  //Your code and svelte html/markup + tailwind below ...  ->
</script>

<div>
  <!-- <MarkdownEditor {carta} /> -->
  <Markdown {carta} {value} />

  <Markdown {carta} value={'```' + value2 + '```'} />
</div>
