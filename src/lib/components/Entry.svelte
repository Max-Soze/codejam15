<script lang="ts">
	import Button2 from './Button2.svelte';
	let { id, date, journalEntry, social, health, discipline, intellect } = $props();
</script>

<div class="righted">

	<p class="title">{new Date(date + 'T00:00:00').toDateString()}</p>
	<div class="scores">
		<p><span class="label">Social:</span> {social}</p>
		<p><span class="label">Health:</span> {health}</p>
		<p><span class="label">Discipline:</span> {discipline}</p>
		<p><span class="label">Intellect:</span> {intellect}</p>
	</div>

	<p class="entry">Entry: {journalEntry}</p>

	<form method="POST" action="/?/deleteEntry">
		<input name="id" type="hidden" value={id} />
		<input name="social" type="hidden" value={social} />
		<input name="health" type="hidden" value={health} />
		<input name="discipline" type="hidden" value={discipline} />
		<input name="intellect" type="hidden" value={intellect} />
		<button>
			<Button2 text="Delete" onClick={() => {}}></Button2>
		</button>
	</form>
</div>



<style>
	.righted{
		margin-left: 50px;
		margin-right: 50px;
	}
	.title {
		position: relative;
		left: 20%;
		font-weight: var(--font-weight-semibold);
	}
	.label {
		display: inline-block;
		width: 230px; /* adjust until lined up */
	}
	.entry {
		position: relative;
		top: 10px;
		font-weight: var(--font-weight-semibold);
		max-width: 260px;
	}
	button{
		position:relative;
		left: 25%;
	}

</style>
