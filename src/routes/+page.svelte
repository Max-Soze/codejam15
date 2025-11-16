<script lang="ts">
	import type { PageProps } from './$types';
	import Popup from '$lib/components/Popup.svelte';
	import TaskForm from '$lib/components/TaskForm.svelte';
	import Task from '$lib/components/Task.svelte';
    import { T, Canvas, useTask, useThrelte} from '@threlte/core';
    import Scene1 from './scene1.svelte';
    import Scene2 from './scene2.svelte';
    import Popup from './Popup.svelte';
    import { Button, Checkbox, Pane, Separator } from 'svelte-tweakpane-ui';
    import {type CameraControlsRef, useTexture, Environment } from '@threlte/extras'
    import { type Mesh, MathUtils } from 'three'
    

	let open = $state(false);

	let { data }: PageProps = $props();

    let controls = $state.raw<CameraControlsRef>();
    let mesh = $state.raw<Mesh>();
    /**
     * controls.enabled can not be bound to since its not reactive
     */
    let enabled = $state(true);
    $effect(() => {
        if (controls !== undefined) {
        controls.enabled = enabled
        }
    })
</script>


{#each Object.entries(data.user) as [key, value]}
	<p>{key}: {value}</p>
{/each}
<br />
<p>There are currently {data.count} tasks registered.</p>
<button onclick={() => (open = true)}>Open</button>
<br />
{#if open}
	<Popup>
		<TaskForm />
		<button onclick={() => (open = false)}>Close</button>
	</Popup>
{/if}

{#each data.taskList as task}
	<br />
	<Task
		_id={task._id}
		task={task.task}
		complete={task.complete}
		xpSocial={task.xpSocial}
		xpHealth={task.xpHealth}
		xpDiscipline={task.xpDiscipline}
		xpIntellect={task.xpIntellect}
		dueDate={task.dueDate}
	/>
{/each}

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
            <Popup bind:controls bind:mesh />
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
</style>
