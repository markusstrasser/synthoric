<script>
  import { T, Canvas } from '@threlte/core'
  import { interactivity } from '@threlte/extras'
  import { spring } from 'svelte/motion'

  // interactivity()
  // const scale = spring(1)
</script>

<Canvas>
  <T.PerspectiveCamera
    makeDefault
    position={[10, 10, 10]}
    oncreate={({ ref }) => {
      ref.lookAt(0, 1, 0)
    }}
  />

  <T.Mesh position.y={1}>
    <T.BoxGeometry args={[1, 2, 1]} />
    <T.MeshBasicMaterial color="hotpink" />
  </T.Mesh>
</Canvas>
