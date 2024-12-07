import type { ActionReturn } from 'svelte/action'

interface Parameter {
	/** 読み仮名を入力するinput要素 */
	kanaInput: HTMLInputElement
	/**
	 * 読み仮名をカタカナで出力するか
	 * @defaultValue false
	 *  */
	katakana?: boolean
}

/**
 * ふりがなを自動で入力するためのSvelte Action
 *
 * @param node - かなを取得する元のinput要素
 * @param options - Actionオプション
 * @param options.kanaInput - 読み仮名を入力するinput要素
 * @param options.katakana - 読み仮名をカタカナで出力するか (デフォルト: `false`)
 *
 * @example
 * ```svelte
 * <form>
 * 	<label for="name">名前</label>
 * 	<input id="name" type="text" use:autoKana={{ kanaInput }} />
 *
 * 	<label for="nameKana">名前（かな）</label>
 * 	<input id="nameKana" type="text" bind:this={kanaInput} />
 * </form>
 * ```
 */
export function autoKana(
	node: HTMLInputElement,
	{ kanaInput, katakana = false }: Parameter
): ActionReturn<Parameter> {
	const HIRAGANA_REGEX = /[ぁ-んー]/g

	let converted = '' // 変換済みのかな
	let pending = '' // 未確定のかな

	const toKatakana = (matches: string[]) => {
		return matches.map((char) => {
			return char === 'ー' ? char : String.fromCharCode(char.charCodeAt(0) + 96)
		})
	}

	node.addEventListener('compositionupdate', (e) => {
		const kana = e.data.match(HIRAGANA_REGEX) ?? []

		// 変換候補を選んでいる最中
		if (kana.length !== e.data.length) {
			return
		}

		pending = (katakana ? toKatakana(kana) : kana).join('')
		kanaInput.value = converted + pending
	})

	// 変換確定
	node.addEventListener('compositionend', () => {
		converted = kanaInput.value
		pending = ''
	})

	// 全部消したときは、かなも消す
	node.addEventListener('input', () => {
		if (node.value === '' && pending === '') {
			kanaInput.value = ''
			converted = ''
			pending = ''
		}
	})

	return {
		update(newOptions) {
			kanaInput = newOptions.kanaInput
			katakana = newOptions.katakana ?? katakana
		},
	}
}
