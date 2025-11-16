<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import {
		interactivity,
		OrbitControls,
		Grid,
		CameraControls,
		type CameraControlsRef,
		useTexture,
		Environment,
		GLTF,
		useDraco,
		Instance,
		useGltf
	} from '@threlte/extras';
	import { Spring } from 'svelte/motion';
	import {
		PointLight,
		Mesh,
		TextureLoader,
		PerspectiveCamera,
		MathUtils,
		Color,
		RepeatWrapping
	} from 'three';
	import { onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';

	const grassTexture = useTexture('/textures/grass.jpg');
	grassTexture.then((tex) => {
		tex.wrapS = tex.wrapT = RepeatWrapping;
		tex.repeat.set(100, 100);
	});

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

	//BUILDING CONSTRUCTOR
	const count = 40; // number of buildings
	const buildings = Array.from({ length: count }, () => ({
		x: (Math.random() - 0.5) * 200,
		z: (Math.random() - 0.5) * 200,
		height: Math.random() * 20 + 5,
		color: new Color(`hsl(${Math.random() * 40}, 30%, 60%)`),
		scale: new Tween(1, { duration: 300, easing: cubicOut })
	}));

	type HouseMap = Record<string, number[]>;
	const dracoLoader = useDraco();
	//const scaleShift = [6, 0, 5, 0, 2, 0, 7.2, 0, 0.05, 2.5, 3, 11.5, 0.05, 0];
	const scaleShift: HouseMap = {
		'/houses/house_0/house_0.gltf': [6, 0],
		'/houses/house_1/house_1.gltf': [5, 0],
		'/houses/house_2/house_2.gltf': [2, 0],
		'/houses/house_3/house_3.gltf': [7.2, 0],
		'/houses/house_4/house_4.gltf': [0.05, 2.5],
		'/houses/house_5/house_5.gltf': [3, 11, 5],
		'/houses/house_6/house_6.gltf': [0.05, 0]
	};
	const allHouses = [
		'/houses/house_0/house_0.gltf',
		'/houses/house_1/house_1.gltf',
		'/houses/house_2/house_2.gltf',
		/*"/houses/house_6/house_6.gltf",*/
		'/houses/house_3/house_3.gltf',
		'/houses/house_4/house_4.gltf',
		'/houses/house_5/house_5.gltf'
	];

	let totalXp = health + discipline + intellect + social;
	let healthLvl = $state(Math.floor(health / 10) > 5 ? 5 : Math.floor(health / 10)); // Health level (max of 5)
	console.log(totalXp);
	console.log(healthLvl);

	let mainHouse = $derived({
		house: allHouses[healthLvl],
		x: 0,
		z: 0,
		scale: new Tween(1, { duration: 300, easing: cubicOut })
	});

	let nbh_count: number;
	if (totalXp < 100) nbh_count = 1;
	else if (totalXp < 250) nbh_count = 6;
	else if (totalXp < 500) nbh_count = 11;
	else if (totalXp < 1000) nbh_count = 16;
	else nbh_count = 21;

	function generateBuilds(count: number, houseOptions: Array<string>) {
		const builds = [];
		for (let i = 0; i < count; i++) {
			let r = (30 + healthLvl * 7) * Math.sqrt(i);
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
	// svelte-ignore state_referenced_locally
	console.log(builds);

	interactivity();
</script>

{#each builds as h}
	{#await useGltf(h.house) then gltf}
		<T
			is={gltf.scene.clone()}
			receiveShadow
			castShadow
			scale={h.scale.current * scaleShift[h.house][0] * 0.6}
			onpointerenter={() => (h.scale.target *= 0.9)}
			onpointerleave={() => (h.scale.target *= 10 / 9)}
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

<T.PointLight intensity={2000} color={0xffff00} position={[20, 40, 20]} />

<T.AmbientLight intensity={1} color={0xffffcc} />

<CameraControls
	bind:ref={controls}
	oncreate={(ref) => {
		ref.setPosition(30, 15, 30);
	}}
/>

<T.Mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
	<T.PlaneGeometry args={[500, 500]} />
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

<Environment url="/textures/daySky.jpg" isBackground />
