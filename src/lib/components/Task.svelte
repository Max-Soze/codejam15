<script lang="ts">
	let { _id, task, complete, xpSocial, xpDiscipline, xpHealth, xpIntellect, dueDate } = $props();
</script>

<div class="task">
	<p>{task}</p>
	<p>{complete}</p>
	<p>{dueDate}</p>
	<div>
		<p>{xpSocial}</p>
		<p>{xpHealth}</p>
		<p>{xpDiscipline}</p>
		<p>{xpIntellect}</p>
	</div>
	<form method="POST" action="/?/completeTask">
		<input name="id" type="text" value={_id} />
		<button>Comp</button>
	</form>
</div>
