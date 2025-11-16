<script lang="ts">
	let { date, journalEntry, social, health, discipline, intellect } = $props();
</script>

<p class="title">{new Date(date + 'T00:00:00').toDateString()}</p>
<div class="scores">
	<p><span class="label">Social:</span> {social}</p>
	<p><span class="label">Health:</span> {health}</p>
	<p><span class="label">Discipline:</span> {discipline}</p>
	<p><span class="label">Intellect:</span> {intellect}</p>
</div>

<p class="entry">Entry: {journalEntry}</p>

<style>
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
</style>
