<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import { interactivity, OrbitControls,  Grid, CameraControls, type CameraControlsRef, useTexture, Environment, GLTF, useDraco, Instance, useGltf } from '@threlte/extras';
  import { Spring } from 'svelte/motion';
  import { PointLight, Mesh, TextureLoader, PerspectiveCamera, MathUtils, Color, RepeatWrapping } from 'three';
  import { onMount } from 'svelte';
  import { cubicOut } from 'svelte/easing';
  import { Tween } from 'svelte/motion';

  function randomSign() {
    return Math.random() < 0.5 ? -1 : 1;
  }

  const grassTexture = useTexture('/textures/grass.jpg');
  grassTexture.then(tex => {
  tex.wrapS = tex.wrapT = RepeatWrapping;
  tex.repeat.set(30, 30);
})

  //BUILDING CONSTRUCTOR
  const count = 40 // number of buildings
  const buildings = Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 200,
    z: (Math.random() - 0.5) * 200,
    height: Math.random() * 20 + 5,
    color: new Color(`hsl(${Math.random() * 40}, 30%, 60%)`),
    scale: new Tween(1, { duration: 300, easing: cubicOut })
  }));


  type HouseMap = Record<string, number[]>
  const dracoLoader = useDraco()
  //const scaleShift = [6, 0, 5, 0, 2, 0, 7.2, 0, 0.05, 2.5, 3, 11.5, 0.05, 0];
  const scaleShift: HouseMap = {
    "/houses/house_0/house_0.gltf": [6, 0],
    "/houses/house_1/house_1.gltf": [5, 0],
    "/houses/house_2/house_2.gltf": [2, 0],
    "/houses/house_3/house_3.gltf": [7.2, 0],
    "/houses/house_4/house_4.gltf": [0.05, 2.5],
    "/houses/house_5/house_5.gltf": [3, 11,5],
    "/houses/house_6/house_6.gltf": [0.05, 0]
  };
  const allHouses = [
    "/houses/house_0/house_0.gltf",
    "/houses/house_1/house_1.gltf",
    "/houses/house_2/house_2.gltf",
    "/houses/house_3/house_3.gltf",
    "/houses/house_4/house_4.gltf",
    "/houses/house_5/house_5.gltf",
    "/houses/house_6/house_6.gltf"
  ];

  let index = 6;
  let mainHouse ={
    house : allHouses[index],
    x: 0,
    z: 0,
    scale: new Tween(1, { duration: 300, easing: cubicOut })
  };

  let nbh_count = index > 5 ? index * 3 : 0;

  let builds = Array.from({ length: nbh_count }, () => ({
    house: allHouses[Math.floor(Math.random()*3 + 3)],
    x: randomSign() * (Math.random() * 200 + 40),
    z: randomSign() * (Math.random() * 200 + 40),
    scale: new Tween(1, { duration: 300, easing: cubicOut }),
  }));

  builds.push(mainHouse);

  console.log(builds);

  let {
    controls = $bindable(),
    mesh = $bindable()
  }: {
    controls?: CameraControlsRef
    mesh?: Mesh
  } = $props()


  interactivity();
</script>

{#each builds as h, i}
    {#await useGltf(h.house) then gltf}
        <T
        is={gltf.scene.clone()}
        receiveShadow
        castShadow
        scale= {h.scale.current * scaleShift[h.house][0] * 0.6}
        onpointerenter={() => h.scale.target *= 0.9}
        onpointerleave={() => h.scale.target *= 10/9}
        position={[h.x, scaleShift[h.house][1] * 0.6, h.z]}
        />
    {/await}
{/each}

<!-- {#each builds as houseType, i}
    {#each houseType as h, j}
        <GLTF
            url={h.house}
            receiveShadow
            castShadow
            scale= {h.scale.current * scaleShift[h.house][0]}
            onpointerenter={() => h.scale.target *= 0.9}
            onpointerleave={() => h.scale.target *= 10/9}
            position={[h.x, scaleShift[h.house][1], h.z]}
        />
    {/each}
{/each} -->

<T.PointLight
    intensity={300}
    color={0xFFFF00}
    position={[0, 100, 0]}
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
    <T.PlaneGeometry args={[1000, 1000]} />
    {#await grassTexture then tex}
        <T.MeshStandardMaterial map={tex} />
    {/await}
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