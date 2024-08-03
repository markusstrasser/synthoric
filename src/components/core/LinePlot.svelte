<script>
  import * as d3 from 'd3'

  let {
    data,
    width = 640,
    height = 400,
    marginTop = 20,
    marginRight = 20,
    marginBottom = 30,
    marginLeft = 40,
  } = $props()

  let gx = $state()
  let gy = $state()

  const x = $derived(d3.scaleLinear([0, data.length - 1], [marginLeft, width - marginRight]))
  const y = $derived(d3.scaleLinear(d3.extent(data), [height - marginBottom, marginTop]))
  const line = $derived(d3.line((d, i) => x(i), y))

  const xAxis = $derived(d3.axisBottom(x))
  const yAxis = $derived(d3.axisLeft(y))

  $effect(() => {
    if (gx) d3.select(gx).call(xAxis)
    if (gy) d3.select(gy).call(yAxis)
  })
</script>

<svg {width} {height}>
  <g bind:this={gx} transform="translate(0,{height - marginBottom})" />
  <g bind:this={gy} transform="translate({marginLeft},0)" />
  <path fill="none" stroke="currentColor" stroke-width="1.5" d={line(data)} />
  <g fill="white" stroke="currentColor" stroke-width="1.5">
    {#each data as d, i}
      <circle cx={x(i)} cy={y(d)} r="2.5" fill="white" />
    {/each}
  </g>
</svg>
