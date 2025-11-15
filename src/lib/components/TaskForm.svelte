<script lang="ts">
	let mode = $state('generate');
	let actionLink = $derived(mode == 'manual' ? '/?/createTask' : '/?/generateTask');
	function toggle() {
		mode = mode == 'manual' ? 'generate' : 'manual';
	}
</script>

<form method="POST" action={actionLink}>
	<button type="button" onclick={toggle}>Toggle Mode</button>
	<label>
		Task
		<input name="task" type="text" />
	</label>
	{#if mode == 'manual'}
		<div class="xp-entry">
			<label>
				Social XP
				<input name="xpSocial" type="number" />
			</label>
			<label>
				Health XP
				<input name="xpHealth" type="number" />
			</label>
			<label>
				Discipline XP
				<input name="xpDiscipline" type="number" />
			</label>
			<label>
				Intellect XP
				<input name="xpIntellect" type="number" />
			</label>
		</div>
	{:else}
		<div class="xp-generation">
			<label>
				Description
				<input name="description" type="text" />
			</label>
			<label>
				Estimated Duration
				<input name="duration" type="number" />
			</label>
		</div>
	{/if}
	<label>
		Due Date
		<input name="dueDate" type="date" />
	</label>
	<button
		>{#if mode == 'manual'}Create Task{:else}Generate Task{/if}</button
	>
</form>
