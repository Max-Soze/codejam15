<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<p>There are currently {data.count} tasks registered.</p>
{#each data.taskList as task}
	<br/>
	{#each Object.entries(task) as [ key, value ]}
		<p>{key}: {value}</p>
	{/each}
{/each}
