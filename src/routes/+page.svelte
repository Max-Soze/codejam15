<script lang="ts">
	import type { PageProps } from './$types';
	import Popup from '$lib/components/Popup.svelte';
	import TaskForm from '$lib/components/TaskForm.svelte';
	import Button2 from '$lib/components/Button2.svelte';
	import Entry from '$lib/components/Entry.svelte';
	import { T, Canvas, useTask, useThrelte } from '@threlte/core';
	import Scene1 from './scene1.svelte';
	import Scene2 from './scene2.svelte';
	import City from './City.svelte';
	import { Button, Checkbox, Pane, Separator } from 'svelte-tweakpane-ui';
	import { type CameraControlsRef, useTexture, Environment } from '@threlte/extras';
	import { type Mesh, MathUtils } from 'three';

	let open = $state(false);

	let { data }: PageProps = $props();
	let entryVisibility = $state(Array(data.count).fill(false));

	let controls = $state.raw<CameraControlsRef>();
	let mesh = $state.raw<Mesh>();
	/**
	 * controls.enabled can not be bound to since its not reactive
	 */
	let enabled = $state(true);
	$effect(() => {
		if (controls !== undefined) {
			controls.enabled = enabled;
		}
	});
</script>

<!--
{#each Object.entries(data.user) as [key, value]}
	<p>{key}: {value}</p>
{/each}
<br />
<p>There are currently {data.count} tasks registered.</p>
-->
<div class="container">
	<div class="left_panel">
		<Button2 onClick={() => (open = true)} text="Create New Entry" />
		<br />
		{#if open}
			<Popup>
				<Button2 onClick={() => (open = false)} text="Close" />
				<TaskForm />
			</Popup>
		{/if}
	</div>
	<div class="right_panel">
		<div class="top_panel"></div>
		<div class="bottom_panel"></div>
	</div>
</div>
<p>You have made {data.count} entries!</p>
<button onclick={() => (open = true)}>Open</button>

{#each data.entryList as entry, i}
	<br />
	<button onclick={() => (entryVisibility[i] = true)}>
		{entry.entryDate}
	</button>
	{#if entryVisibility[i]}
		<Popup>
			<Entry
				date={entry.entryDate}
				journalEntry={entry.journalEntry}
				social={entry.xpSocial}
				health={entry.xpHealth}
				discipline={entry.xpDiscipline}
				intellect={entry.xpIntellect}
			/>
			<button onclick={() => (entryVisibility[i] = false)}>Close</button>
		</Popup>
	{/if}
{/each}

<!-- 
<Pane
  title="Movement"
  position="fixed"
>
    <Button
        title="zoom in"
        on:click={() => {
        controls?.dolly(20, true)
        }}
    />
    <Button
        title="zoom out"
        on:click={() => {
        controls?.dolly(-20, true)
        }}
    />
    <Button
        title="turn left"
        on:click={() => {
        controls?.rotate(90 * MathUtils.DEG2RAD, 0, true)
        }}
    />
    <Button
        title="turn right"
        on:click={() => {
        controls?.rotate(-90 * MathUtils.DEG2RAD, 0, true)
        }}
    />
</Pane>

<div class='container'>
    <div class="city">
        <Canvas>
            <City bind:controls bind:mesh />
        </Canvas>
    </div>
</div>

<style>
    .container {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100vh; /* full height */
}

.container > div {
    flex: 1;             /* each takes up 50% of the space */
    height: 100%;
    overflow: hidden;    /* prevents scrollbars if canvas overflows */
}
</style> -->

<style>
	.container {
		height: 100vh;
		width: 100%;
		display: grid;
		grid-template-columns: 2fr 5fr;
	}
	.left_panel {
		background-color: var(--color-bg);

		min-width: 200px;
	}
	.right_panel {
		background-color: white;
		display: grid;
		grid-template-rows: 1fr 4fr;
		.top_panel {
		}
		.bottom_panel {
			background-color: aquamarine;
		}
	}
</style>
