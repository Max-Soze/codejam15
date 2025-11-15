<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import { interactivity, OrbitControls,  Grid, CameraControls, type CameraControlsRef, useTexture, Environment } from '@threlte/extras';
  import { Spring } from 'svelte/motion';
  import { PointLight, Mesh, TextureLoader, PerspectiveCamera, MathUtils, Color } from 'three';

  const count = 10 // number of buildings
  const buildings = Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 200,
    z: (Math.random() - 0.5) * 200,
    height: Math.random() * 20 + 5,
    color: new Color(`hsl(${Math.random() * 40}, 30%, 60%)`)
  }));

  const earthTexture = useTexture('/earth.jpg');
  const skyTexture = useTexture('/daySky.jpg');

  earthTexture.then(() => {
    console.log('texture has loaded')
  })
  $inspect($earthTexture) // eventually a Three.Texture

  let {
    controls = $bindable(),
    mesh = $bindable()
  }: {
    controls?: CameraControlsRef
    mesh?: Mesh
  } = $props()

  //interactivity();
</script>

<T.PointLight
    intensity={1}
    color={0xFFFFFF}
    position={[0, 4, 0]}
/>

<T.AmbientLight
    intensity={0.1}
    color={0xFFFFFF}
/>

<CameraControls
  bind:ref={controls}
  oncreate={(ref) => {
    ref.setPosition(15, 15, 15)
  }}
/>

<T.Mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
    <T.PlaneGeometry args={[500, 500]} />
    <T.MeshStandardMaterial color="#333" />
</T.Mesh>

{#each buildings as b}
    <T.Mesh
      castShadow
      position={[b.x, b.height / 2, b.z]}
    >
      <T.BoxGeometry args={[6, b.height, 6]} />
      <T.MeshStandardMaterial color={b.color} />
    </T.Mesh>
{/each}

<Grid
  sectionColor="#ff3e00"
  sectionThickness={1}
  cellColor="#cccccc"
  gridSize={40}
/>

