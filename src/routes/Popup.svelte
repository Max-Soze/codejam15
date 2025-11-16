<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import { interactivity, OrbitControls,  Grid, CameraControls, type CameraControlsRef, useTexture, Environment, GLTF, useDraco } from '@threlte/extras';
  import { Spring } from 'svelte/motion';
  import { PointLight, Mesh, TextureLoader, PerspectiveCamera, MathUtils, Color } from 'three';
  import { onMount } from 'svelte';
  import { cubicOut } from 'svelte/easing';
  import { Tween } from 'svelte/motion';

  //BUILDING CONSTRUCTOR
  const count = 40 // number of buildings
  const buildings = Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 200,
    z: (Math.random() - 0.5) * 200,
    height: Math.random() * 20 + 5,
    color: new Color(`hsl(${Math.random() * 40}, 30%, 60%)`),
    scale: new Tween(1, { duration: 300, easing: cubicOut })
  }));


  const dracoLoader = useDraco()
  const scaleShift = [6, 0, 5, 0, 2, 0, 7.2, 0, 0.05, 2.5, 3, 11.5, 0.05, 0];
  const houses = ["/houses/house_0/house_0.gltf",
    "/houses/house_1/house_1.gltf",
    "/houses/house_2/house_2.gltf",
    "/houses/house_3/house_3.gltf",
    "/houses/house_4/house_4.gltf",
    "/houses/house_5/house_5.gltf",
    "/houses/house_6/house_6.gltf"
  ];
  const house_count = houses.length;
  const builds = Array.from({ length: house_count}, () => ({
    x: (Math.random() - 0.5) * 200,
    z: (Math.random() - 0.5) * 200,
    scale: new Tween(1, { duration: 300, easing: cubicOut }),
  }));


  let {
    controls = $bindable(),
    mesh = $bindable()
  }: {
    controls?: CameraControlsRef
    mesh?: Mesh
  } = $props()


  function shrink (i: number) {
    builds[i].scale.target *= 0.9;
  }
  function grow (i: number) {
    builds[i].scale.target *= 10/9;
  }

  interactivity();
</script>

{#each houses as h, i}
<GLTF
    url={h} {dracoLoader}
    scale= {builds[i].scale.current * scaleShift[2*i]}
    onpointerenter={() => shrink(i)}
    onpointerleave={() => grow(i)}
    position={[50 * (i - 3), scaleShift[2*i + 1], 50 * (i - 3)]}
    />
{/each}

<T.PointLight
    intensity={100}
    color={0xFFFF55}
    position={[0, 50, 0]}
/>


<T.AmbientLight
    intensity={1}
    color={0xFFFFcc}
/>

<CameraControls
  bind:ref={controls}
  oncreate={(ref) => {
    ref.setPosition(30, 30, 30)
  }}
/>

<T.Mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
    <T.PlaneGeometry args={[500, 500]} />
    <T.MeshStandardMaterial color="#333" />
</T.Mesh>

<!-- {#each buildings as b}
    <T.Mesh
        receiveShadow
        castShadow

        position={[b.x, b.height / 2, b.z]}
        scale={b.scale.current}

        onpointerenter={() => b.scale.target = 0.9}
        onpointerleave={() => b.scale.target = 1}
    >
      <T.BoxGeometry args={[6, b.height, 6]} />
      <T.MeshStandardMaterial color={b.color} />
    </T.Mesh>
{/each} -->

<Grid
  sectionColor="#ff3e00"
  sectionThickness={1}
  cellColor="#cccccc"
  gridSize={40}
/>

<Environment url="/textures/daySky.jpg" isBackground />