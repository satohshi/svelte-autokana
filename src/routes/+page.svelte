<script lang="ts">
	import { createAutoKana, type Options } from '$lib/index.svelte.js'

	const options = $state<Options>({ katakana: false })
	const [nameSource, nameKana] = createAutoKana(options)
</script>

<div>
	<label style="display: flex;">
		<input type="checkbox" bind:checked={options.katakana} />
		<span>カタカナ</span>
	</label>

	<label>
		<span>名前</span>
		<input type="text" use:nameSource />
	</label>

	<label>
		<span>名前（{options.katakana ? 'カナ' : 'かな'}）</span>
		<input type="text" use:nameKana />
	</label>
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 20rem;
		padding: 1rem;
	}

	span {
		display: block;
		padding: 0.25rem;
	}

	input {
		padding: 0.5rem;
		font-size: 1.25rem;
	}
</style>
