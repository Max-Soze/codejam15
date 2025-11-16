<script lang="ts">
	import { DiscreteInterpolant } from 'three';

	let { social, health, discipline, intellect } = $props();
</script>

<div>
	<p>{social}</p>
	<p>{health}</p>
	<p>{discipline}</p>
	<p>{intellect}</p>
</div>
