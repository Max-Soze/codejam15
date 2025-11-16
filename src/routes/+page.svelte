<script lang="ts">
	import type { PageProps } from './$types';
	import Popup from '$lib/components/Popup.svelte';
	import TaskForm from '$lib/components/TaskForm.svelte';
	import Button2 from '$lib/components/Button2.svelte';
	import Entry from '$lib/components/Entry.svelte';
	import Stats from '$lib/components/Stats.svelte';
	import { T, Canvas } from '@threlte/core';
	import City from './City.svelte';
	import { type CameraControlsRef } from '@threlte/extras';
	import { type Mesh, MathUtils } from 'three';

	let open = $state(false);

	let { data }: PageProps = $props();
	let entries = data.entryList;
	entries.sort((a, b) => a.entryDate.localeCompare(b.entryDate)).reverse();

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
<div class="contain">
	<div class="left_panel">
		<div class="please_center">
			<Button2 onClick={() => (open = true)} text="Create New Entry" />
		</div>
		<p class="normal_text">You have made {data.count} entries!</p>

		{#each entries as entry, i}
			<br />
			<button class="btn-primary" onclick={() => (entryVisibility[i] = true)}>
				{new Date(entry.entryDate + 'T00:00').toDateString()}
			</button>
			{#if entryVisibility[i]}
				<div class="popup">
					<Popup>
						<Entry
							id={entry._id}
							date={entry.entryDate}
							journalEntry={entry.journalEntry}
							social={entry.xpSocial}
							health={entry.xpHealth}
							discipline={entry.xpDiscipline}
							intellect={entry.xpIntellect}
						/>
						<div class="centered">
							<Button2 onClick={() => (entryVisibility[i] = false)} text="Close" />
						</div>
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
		<div class="top_panel">
			<Stats
				total={Number(data.user.xpTotal)}
				health={Number(data.user.xpHealth)}
				social={Number(data.user.xpSocial)}
				discipline={Number(data.user.xpDiscipline)}
				intellect={Number(data.user.xpIntellect)}
			/>
		</div>
		<div class="bottom_panel">
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

<style>
	.please_center {
		width: 85%;
	}
	.normal_text {
		position: relative;
		left: 10px;
	}
	.contain {
		height: 100vh;
		width: 100vw;
		display: grid;
		grid-template-columns: 2fr 5fr;
		font-family: 'Courier New', Courier, monospace;
		color: var(--color-yellow-800);
		background-color: var(--color-yellow-800);
	}
	.left_panel {
		background-color: var(--color-bg);
		outline: 3px solid var(--color-yellow-800);    
    	outline-offset: -3px;    
		border-radius: 20px; 

		min-width: 200px;
	}
	.right_panel {
		background-color: var(--color-yellow-800);
		display: grid;
		grid-template-rows: 1fr 4fr;
		height:100%;
		.top_panel {
		background-color: var(--color-bg);
		outline: 3px solid var(--color-yellow-800);    
    	outline-offset: -3px;    
		border-radius: 20px; 
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
	.centered {
		position: relative;
		left: 28%;
	}
</style>
