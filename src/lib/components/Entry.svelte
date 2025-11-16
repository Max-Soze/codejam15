<script lang="ts">
	let { date, journalEntry, social, health, discipline, intellect } = $props();
</script>

<!-- <div class="task">
	<p>{task}</p>
	<p>{dueDate}</p>
	<div>
		<p>Social: {xpSocial}</p>
		<p>Health: {xpHealth}</p>
		<p>Discipline: {xpDiscipline}</p>
		<p>Intellect: {xpIntellect}</p>
	</div>
	<form method="POST" action="/?/completeTask">
		<input name="id" type="hidden" value={_id} />
		<input name="xpSocial" type="hidden" value={xpSocial} />
		<input name="xpDiscipline" type="hidden" value={xpDiscipline} />
		<input name="xpHealth" type="hidden" value={xpHealth} />
		<input name="xpIntellect" type="hidden" value={xpIntellect} />
		<button>Comp</button>
	</form>
</div> -->

<p class="title">{new Date(date).toDateString()}</p>
<div class="scores">

	<p><span class="label">Social:</span> {social}</p>
	<p><span class="label">Health:</span> {health}</p>
	<p><span class="label">Discipline:</span> {discipline}</p>
	<p><span class="label">Intellect:</span> {intellect}</p>


</div>


	<p class="entry">Entry: {journalEntry}</p>

<style>
	.title{
		position:relative;
		left:20%;
		font-weight: var(--font-weight-semibold);

	}
	.label {
	display: inline-block;
	width: 230px; /* adjust until lined up */
	}
	.entry{
		position:relative;
		top:10px;
		font-weight: var(--font-weight-semibold);
		max-width: 260px;
	}


</style>
