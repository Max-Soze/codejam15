<script lang="ts">
  import { T, useTask } from '@threlte/core'
  import { interactivity, OrbitControls } from '@threlte/extras';
  import { Spring } from 'svelte/motion';

  interactivity();
  const scale = new Spring(1);

  let rotation = 0;

  useTask((delta) => {
    rotation += delta * 0.5
  })


</script>
<T.PerspectiveCamera
  makeDefault
  position={[10, 10, 10]}
>
  <OrbitControls autoRotate enableDamping />
</T.PerspectiveCamera>

<T.AmbientLight color='0x3030FF'></T.AmbientLight>
<T.Mesh
  scale={scale.current}
  onpointerenter={() => scale.target = 0.5}
  onpointerleave={() => scale.target = 1}
  
  rotation.y={rotation}
  rotation.x={rotation*0.5}
  rotation.z={rotation}
>
  <T.BoxGeometry args={[3, 3, 3]} />
  <T.MeshStandardMaterial color="red"/>
</T.Mesh>