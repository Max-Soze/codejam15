<script lang="ts">
	let { _id, task, complete, xpSocial, xpDiscipline, xpHealth, xpIntellect, dueDate } = $props();
</script>

<div class="task">
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
</div>
