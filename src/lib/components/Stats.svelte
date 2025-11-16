<script lang="ts">
	import { DiscreteInterpolant } from 'three';

	let { total, social, health, discipline, intellect } = $props();
</script>

<div>
	<p>{total}</p>
	<p>{social}</p>
	<p>{health}</p>
	<p>{discipline}</p>
	<p>{intellect}</p>
</div>
