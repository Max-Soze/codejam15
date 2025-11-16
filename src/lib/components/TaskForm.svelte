<script lang="ts">
	import ButtonSlider from './ButtonSlider.svelte';

	let mode = $state('automatic');
	let actionLink = $derived(mode == 'manual' ? '/?/createEntry' : '/?/generateEntry');
</script>

<form method="POST" action={actionLink} style="font-family: 'Courier New', monospace;">
	<div class="slider">
		<ButtonSlider left="manual" right="automatic" bind:selected={mode} />
	</div>
	{#if mode == 'manual'}
		<label>
			Journal Entry
			<input name="entry" type="text" style="width:450px; height:50px" />
		</label>
		<div class="xp-entry grid grid-cols-2 gap-2" style="width:450px">
			<div>
				<label class="label">
					Social XP
					<input name="xpSocial" type="number" />
				</label>
				<label class="label">
					Health XP
					<input name="xpHealth" type="number" />
				</label>
			</div>
			<div>
				<label class="label">
					Discipline XP
					<input name="xpDiscipline" type="number" />
				</label>
				<label class="label">
					Intellect XP
					<input name="xpIntellect" type="number" />
				</label>
			</div>
		</div>
	{:else}
		<div class="xp-generation">
			<label class="label">
				Tell me about your day
				<input name="description" type="text" style="width:450px; height:200px" />
			</label>
		</div>
	{/if}
	<label>
		Date
		<input name="entryDate" type="date" value={new Date().toISOString().slice(0, 10)} />
	</label>
	<button class="btn-primary"
		>{#if mode == 'manual'}Create Entry{:else}Generate Entry{/if}</button
	>
</form>

<style>
	.slider {
		position: relative;
		left: 27%;
		top: 10px;
	}

	form {
		background-color: var(--color-bg);
		color: var(--color-yellow-800);
		height: 400px;
		width: 475px;
		position: relative;
	}
	input {
		border-radius: 10px;
		border-width: 1.5px;
		border-color: var(--color-yellow-800);
		background-color: var(--color-amber-50);
		position: relative;
		left: 0px;

		display: flex;
	}

	label {
		-ms-flex-align: start;
		position: relative;
		top: 10px;
		left: 10px;
		text-align: left;

		.tasklabel {
			width: 450px;
		}
	}

	.btn-primary {
		/* Rounded borders */
		border-radius: 40px;

		/* Background*/
		background-color: var(--color-bg);
		padding: 10px 10px;

		/* Text */
		font-weight: var(--font-weight-semibold);
		color: var(--color-yellow-800);

		/* Outside the button */
		box-shadow: var(--shadow-md);
		border: 1px solid var(--color-yellow-800);

		cursor: pointer;
		transition: background-color 0.2s ease;

		/* position */
		position: relative;
		top: 20px;
		left: 305px;
		right: 30px;
		bottom: 20px;
	}

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-primary:hover {
		@media (hover: hover) {
			background-color: var(--color-hover);
		}
	}
	.btn-primary:active {
		transform: scale(0.95);
	}
</style>
