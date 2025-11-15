<script lang="ts">
  import { T } from '@threlte/core'
</script>
<T.PerspectiveCamera
  position={[10, 10, 10]}
  oncreate={(ref) => {
    ref.lookAt(0, 0, 0)
  }}
/>

<T.AmbientLight color=white></T.AmbientLight>
<T.Mesh>
  <T.BoxGeometry args={[1, 1, 1]} />
  <T.MeshStandardMaterial color="red" />
</T.Mesh>