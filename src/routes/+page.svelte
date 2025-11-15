<script lang="ts">
	import type { PageProps } from './$types';
	import Popup from '$lib/components/Popup.svelte';

	let open = $state(false);

	let { data }: PageProps = $props();
</script>

{#each Object.entries(data.user) as [key, value]}
	<p>{key}: {value}</p>
{/each}
<br/>
<p>There are currently {data.count} tasks registered.</p>
<button onclick={() => open = true}>Open</button>
<br/>
{#if open}
	<Popup>
		{#each data.taskList as task}
			<br/>
			{#each Object.entries(task) as [ key, value ]}
				<p>{key}: {value}</p>
			{/each}
		{/each}
		<button onclick={() => open = false}>Close</button>
	</Popup>
{/if}