import type { ActionReturn } from 'svelte/action'

interface Parameter {
	kanaInput: HTMLInputElement
	katakana?: boolean
}

export function autoKana(
	node: HTMLInputElement,
	{ kanaInput, katakana = false }: Parameter
): ActionReturn<Parameter> {
	const HIRAGANA_REGEX = /[ぁ-んー]/g

	let converted = '' // 変換済みのかな
	let pending = '' // 未確定のかな

	// Svelte 4はbind前(i.e. kanaInputがundefined)にActionを呼んでしまうのため、bind後にupdate()でreassignできるようにする
	let target = kanaInput

	const toKatakana = (matches: string[]) => {
		return matches.map((char) => {
			return char === 'ー' ? char : String.fromCharCode(char.charCodeAt(0) + 96)
		})
	}

	node.addEventListener('compositionupdate', (e) => {
		const kana = e.data.match(HIRAGANA_REGEX) ?? []
		if (kana.length !== e.data.length) return // 変換候補を選んでいる最中
		pending = (katakana ? toKatakana(kana) : kana).join('')
		target.value = converted + pending
	})

	// 変換確定
	node.addEventListener('compositionend', () => {
		converted = target.value
		pending = ''
	})

	// 全部消したときは、かなも消す
	node.addEventListener('input', () => {
		if (node.value === '' && pending === '') {
			target.value = ''
			converted = ''
			pending = ''
		}
	})

	return {
		// Svelte 5では不要
		update({ kanaInput }) {
			target = kanaInput
		},
	}
}
