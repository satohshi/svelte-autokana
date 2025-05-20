<script lang="ts">
	import { createAutoKana, type Options } from '$lib/index.svelte.js'

	const options = $state<Options>({ mode: 'hiragana', clearWhenEmpty: true })
	const [nameKanji, nameKana] = createAutoKana(options)
</script>

<div>
	<label style="display: flex;">
		<input
			type="checkbox"
			oninput={(e) => {
				options.mode = e.currentTarget.checked ? 'katakana' : 'hiragana'
			}}
		/>
		<span>カタカナ</span>
	</label>

	<label style="display: flex;">
		<input type="checkbox" bind:checked={options.clearWhenEmpty} />
		<span>かなもクリア</span>
	</label>

	<label>
		<span>名前</span>
		<input {@attach nameKanji} type="text" />
	</label>

	<label>
		<span>名前（{options.mode === 'katakana' ? 'カナ' : 'かな'}）</span>
		<input {@attach nameKana} type="text" />
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
