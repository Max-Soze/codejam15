<script lang="ts">
	import { T } from '@threlte/core';
	import {
		interactivity,
		CameraControls,
		type CameraControlsRef,
		useTexture,
		Environment,
		useGltf
	} from '@threlte/extras';
	import { Mesh, RepeatWrapping } from 'three';
	import { cubicOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';

	//List of props
	let {
		controls = $bindable(),
		mesh = $bindable(),
		health,
		discipline,
		intellect,
		social
	}: {
		controls?: CameraControlsRef;
		mesh?: Mesh;
		health: number;
		discipline: number;
		intellect: number;
		social: number;
	} = $props();

	//Generation of grass texture
	const grassTexture = useTexture('/textures/grass.jpg');
	grassTexture.then((tex) => {
		tex.wrapS = tex.wrapT = RepeatWrapping;
		tex.repeat.set(60, 60);
	});

	type HouseMap = Record<string, number[]>;

	//Mapping of each house to how they should be scaled and shifted in y

	const scaleShift: HouseMap = {
		'/houses/house_0/house_0.gltf': [6, 0],
		'/houses/house_1/house_1.gltf': [5, 0],
		'/houses/house_2/house_2.gltf': [2, 0],
		'/houses/house_3/house_3.gltf': [7.2, 0],
		'/houses/house_4/house_4.gltf': [0.05, 2.5],
		'/houses/house_5/house_5.gltf': [3, 11.5],
		'/houses/house_6/house_6.gltf': [0.05, 0]
	};
	//List of used housed
	const allHouses = [
		'/houses/house_0/house_0.gltf',
		'/houses/house_1/house_1.gltf',
		'/houses/house_2/house_2.gltf',
		'/houses/house_3/house_3.gltf',
		'/houses/house_5/house_5.gltf'
	];

	let totalXp = health + discipline + intellect + social; // Should we encase in $state()?

  // Health level (max of 5)
  health = 10;
  let healthLvl: number;
  if (health < 50 ) healthLvl = 0;
  else if (health < 150) healthLvl = 1;
  else if (health < 300) healthLvl = 2;
  else if (health < 500) healthLvl = 3;
  else healthLvl = 4;

  //Generation of the plan for the position of each house
  totalXp = 10;
  let nbh_count: number;
  if (totalXp < 100) nbh_count = 1;
  else if (totalXp < 250) nbh_count = 6;
  else if (totalXp < 500) nbh_count = 11;
  else if (totalXp < 1000) nbh_count = 16;
  else nbh_count = 21;

	function generateBuilds(count: number, houseOptions: Array<string>) {
		const builds = [];
		for (let i = 0; i < count; i++) {
			let r = 50 * Math.sqrt(i);
			builds.push({
				house: houseOptions[healthLvl],
				x: Math.sin((Math.PI * i * 11) / 30) * r,
				z: Math.cos((Math.PI * i * 11) / 30) * r,
				scale: new Tween(1, { duration: 300, easing: cubicOut })
			});
		}
		return builds;
	}

	let builds = $derived(generateBuilds(nbh_count, allHouses));

	interactivity();
</script>

<!-- 3D rendering of every house -->
{#each builds as h}
	{#await useGltf(h.house) then gltf}
		<T
			is={gltf.scene.clone()}
			receiveShadow
			castShadow
			scale={h.scale.current * scaleShift[h.house][0] * 0.6}
			onpointerenter={() => (h.scale.target *= 0.95)}
			onpointerleave={() => (h.scale.target *= 20 / 19)}
			position={[h.x, scaleShift[h.house][1] * 0.6, h.z]}
		/>
	{/await}
{/each}

<!-- Sun -->
<T.PointLight intensity={7000} color={0xffff00} position={[-50, 70, -50]} />

<!-- general lighting -->
<T.AmbientLight
    intensity={5}
    color={0xFFBBAA}
/>

<!-- POV control -->
<CameraControls
	bind:ref={controls}
	oncreate={(ref) => {
		ref.setPosition(15, 20, 45);
	}}
/>

<!-- Plane of grass -->
<T.Mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
    <T.CircleGeometry args={[260, 100]} />
    {#await grassTexture then tex}
        <T.MeshStandardMaterial map={tex} />
    {/await}
</T.Mesh>

<Environment 
  url="/textures/Sky.png"
  isBackground
/>