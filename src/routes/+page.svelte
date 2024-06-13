<script lang="ts">
	import { autoKana } from '$lib/index.js'

	let kanaInput: HTMLInputElement
</script>

<div>
	<label>
		<span>名前</span>
		<input type="text" use:autoKana={{ kanaInput }} />
	</label>

	<label>
		<span>名前（かな）</span>
		<input type="text" bind:this={kanaInput} />
	</label>
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		gap: 2rem;
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
