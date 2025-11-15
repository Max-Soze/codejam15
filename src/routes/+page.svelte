<script lang="ts">
	import type { PageProps } from './$types';
	import Popup from '$lib/components/Popup.svelte';
	import TaskForm from '$lib/components/TaskForm.svelte';
	import Task from '$lib/components/Task.svelte';

	let open = $state(false);

	let { data }: PageProps = $props();
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
