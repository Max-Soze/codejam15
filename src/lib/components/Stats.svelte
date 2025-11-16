<script lang="ts">
	import { DiscreteInterpolant } from 'three';
	import Progress from './Progress.svelte';
	// import Percentage from './Percentage.svelte';

	let { total, social, health, discipline, intellect } = $props();
</script>

<div>
	<p class="title2">My Statistics</p>
</div>

<div class="section grid grid-cols-2">
	<div>
		<p>{total}</p>
		<p>Social</p>
		<p>
			social_val = {social}
			<Progress value={75} color="#f97316" />
		</p>
		<p>Health</p>
		<p>{health}</p>
	</div>
	<div>
		<p>Discipline</p>
		<p>{discipline}</p>
		<p>Intellect</p>
		<p>{intellect}</p>
	</div>
</div>

<style>
	.title2 {
		position: relative;
		left: 15px;
		top: 10px;
		font-weight: var(--font-weight-semibold);
	}
	.section {
		position: relative;
		margin-top: 10px;
		margin-left: 15px;
	}
</style>
