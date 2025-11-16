<script lang="ts">
	let { _id, task, complete, xpSocial, xpDiscipline, xpHealth, xpIntellect, dueDate } = $props();
</script>

<div class="task">
	<p>{task}</p>
	<p>{dueDate}</p>
	<div>
		<p>{xpSocial}</p>
		<p>{xpHealth}</p>
		<p>{xpDiscipline}</p>
		<p>{xpIntellect}</p>
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
