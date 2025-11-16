<script lang="ts">
	let mode = $state('generate');
	let actionLink = $derived(mode == 'manual' ? '/?/createEntry' : '/?/generateEntry');
	function toggle() {
		mode = mode == 'manual' ? 'generate' : 'manual';
	}
</script>

<form method="POST" action={actionLink}>
	<button type="button" onclick={toggle}>Toggle Mode</button>
	{#if mode == 'manual'}
		<label>
			Journal Entry
			<input name="entry" type="text" />
		</label>
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
				Tell me about your day
				<input name="description" type="text" />
			</label>
		</div>
	{/if}
	<label>
		Date
		<input name="dueDate" type="date" value={new Date().toISOString().slice(0, 10)} />
	</label>
	<button
		>{#if mode == 'manual'}Create Entry{:else}Generate Entry{/if}</button
	>
</form>
