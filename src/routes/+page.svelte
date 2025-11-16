<script lang="ts">
	import type { PageProps } from './$types';
	import Popup from '$lib/components/Popup.svelte';
	import TaskForm from '$lib/components/TaskForm.svelte';
	import Button2 from '$lib/components/Button2.svelte';
	import Entry from '$lib/components/Entry.svelte';
	import { T, Canvas } from '@threlte/core';
	import City from './City.svelte';
	import { Button, Pane } from 'svelte-tweakpane-ui';
	import { type CameraControlsRef } from '@threlte/extras';
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
		<p class="normal_text">You have made {data.count} entries!</p>

		{#each data.entryList as entry, i}
			<br />
			<button class="btn-primary" onclick={() => (entryVisibility[i] = true)}>
				{entry.entryDate}
			</button>
			{#if entryVisibility[i]}
				<div class="popup">
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
				</div>
			{/if}
		{/each}
		{#if open}
			<div class="popup">
				<Popup>
					<Button2 onClick={() => (open = false)} text="Close" />
					<TaskForm />
				</Popup>
			</div>
		{/if}
	</div>
	<div class="right_panel">
		<div class="top_panel"></div>
		<div class="bottom_panel">
			<div class="container">
				<div class="city">
					<Canvas>
						<City
							bind:controls
							bind:mesh
							health={Number(data.user.xpHealth)}
							discipline={Number(data.user.xpDiscipline)}
							intellect={Number(data.user.xpIntellect)}
							social={Number(data.user.xpSocial)}
						/>
					</Canvas>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.normal_text {
		position: relative;
		left: 10px;
	}
	.container {
		height: 100vh;
		width: 100%;
		display: grid;
		grid-template-columns: 2fr 5fr;
		font-family: 'Courier New', Courier, monospace;
		color: var(--color-yellow-800);
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

	.btn-primary {
		/* Rounded borders */
		border-radius: 10px;

		/* Background*/
		background-color: var(--color-bg);
		padding: 10px 10px;

		/* Text */
		color: var(--color-yellow-800);

		/* Outside the button */
		box-shadow: var(--shadow-md);
		border: 1px solid var(--color-yellow-800);

		/*size*/
		width: 85%;

		/*animation*/
		cursor: pointer;
		transition: background-color 0.2s ease;

		/* position */
		position: relative;
		top: 20px;
		left: 20px;
		right: 20px;
		bottom: 20px;
		margin-bottom: 5px;
	}

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-primary:hover {
		@media (hover: hover) {
			background-color: var(--color-hover);
		}
	}
	.btn-primary:active {
		transform: scale(0.95);
	}
	.popup {
		position: absolute;
		z-index: 1;
	}
	.container {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 100vh; /* full height */
	}

	.container > div {
		flex: 1; /* each takes up 50% of the space */
		height: 100%;
		overflow: hidden; /* prevents scrollbars if canvas overflows */
	}
</style>
