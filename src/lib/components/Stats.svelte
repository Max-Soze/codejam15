<script lang="ts">

	import Progress from './Progress.svelte';
	export let total: number;
	export let social: number;
	export let health: number;
	export let discipline: number;
	export let intellect: number;


	//let { total, social, health, discipline, intellect } = $props();
</script>
<div class="all">
	<div>
		<p class="title2">My Statistics</p>
	</div>
	<div class="indent">
		<p>Overall Points</p>
				<p>
					<Progress category="overall" value={total} color="#f97316" />
				</p>
	</div>

	<div class="section grid grid-cols-2">
		<div>
			
			<p>Social</p>
			<p>
				<Progress category="social" value={social} color="#f97316" />
			</p>
			<p>Health</p>
			<p>
				<Progress category="health" value={health} color="#f97316" />
			</p>

		</div>
		<div>
			<p>Discipline</p>
			<p>
				<Progress category="discipline" value={discipline} color="#f97316" />
			</p>
			<p>Intellect</p>
			<p>
				<Progress category="intellect" value={intellect} color="#f97316" />
			</p>
		</div>
	</div>
</div>

<style>
	.title2 {
		position: relative;
		left:45%;


		top: 10px;
		font-weight: var(--font-weight-semibold);
	}
	.section {
		position: relative;
		margin-top: 10px;
		margin-left: 15px;
	}
	.indent{
		margin-top:10px;
		margin-left: 15px;
		width:100%;
	}
	.all{
		align-items: center;

	}
</style>
