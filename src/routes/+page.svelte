<script lang="ts">
	import type { PageProps } from './$types';
	import Popup from '$lib/components/Popup.svelte';
	import TaskForm from '$lib/components/TaskForm.svelte';
	import Task from '$lib/components/Task.svelte';
	import Button from '$lib/components/Button.svelte';

	let open = $state(false);

	let { data }: PageProps = $props();
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
		<Button onClick={() => (open = true)} text="Create New Entry"/>
		<br />
		{#if open}
			<Popup>
				<Button onClick={() => (open = false)} text="Close"/>
				<TaskForm  />
				
			</Popup>
		{/if}
	</div>
	<div class="right_panel">
		<div class="top_panel">

		</div>
		<div class="bottom_panel">
			
		</div>

	</div>
</div>
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

<style>
	.container{
		height:100vh;
		width:100%;
		display: grid;
		grid-template-columns: 2fr 5fr;
	}
	.left_panel{
		background-color: var(--color-bg);

		min-width: 200px;
	}
	.right_panel{
		background-color:white;
		display:grid;
		grid-template-rows: 1fr 4fr;
		.top_panel{
			


		}
		.bottom_panel{
			background-color: aquamarine;

		}
	}
</style>



