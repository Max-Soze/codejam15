<script lang="ts">
	import { DiscreteInterpolant } from 'three';
	import Progress from '$lib/components/Progress.svelte';
	import { getCategoryLevel, getTotalLevel, lvlToPointsCat, lvlToPointsTot } from '$lib/statLevel';
	// import Percentage from './Percentage.svelte';

	let { total, social, health, discipline, intellect } = $props();

	let totalLvl = getTotalLevel(total);
	let socialLvl = getCategoryLevel(social);
	let healthLvl = getCategoryLevel(health);
	let disciplineLvl = getCategoryLevel(discipline);
	let intellectLvl = getCategoryLevel(intellect);

	let adjustedSocial = social - lvlToPointsCat[Math.max(0, socialLvl - 1)];
	let adjustedHealth = health - lvlToPointsCat[Math.max(0, healthLvl - 1)];
	let adjustedDiscipline = discipline - lvlToPointsCat[Math.max(0, disciplineLvl - 1)];
	let adjustedIntellect = intellect - lvlToPointsCat[Math.max(0, intellectLvl - 1)];
</script>

<div>
	<p class="title2">My Statistics</p>
</div>

<div class="section grid grid-cols-2">
	<p>Total</p>
	<p>
		<Progress value={(total / lvlToPointsTot[Math.min(4, totalLvl + 1)]) * 100} color="#f97316" />
	</p>
	<div>
		<p>Social</p>
		<p>
			<Progress
				value={(social / lvlToPointsCat[Math.min(4, socialLvl + 1)]) * 100}
				color="#f97316"
			/>
		</p>
		<p>Health</p>
		<p>
			<Progress
				value={(health / lvlToPointsCat[Math.min(4, healthLvl + 1)]) * 100}
				color="#f97316"
			/>
		</p>
	</div>
	<div>
		<p>Discipline</p>
		<p>
			<Progress
				value={(discipline / lvlToPointsCat[Math.min(4, disciplineLvl + 1)]) * 100}
				color="#f97316"
			/>
		</p>
		<p>Intellect</p>
		<p>
			<Progress
				value={(intellect / lvlToPointsCat[Math.min(4, intellectLvl + 1)]) * 100}
				color="#f97316"
			/>
		</p>
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
