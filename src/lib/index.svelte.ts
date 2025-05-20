import type { Attachment } from 'svelte/attachments'

export interface Options {
	/** ひらがなかカタカナか (デフォルト: `hiragana`) */
	mode?: 'hiragana' | 'katakana'
	/** 元のinputを空にしたときに、かなも消すか (デフォルト: `true`) */
	clearWhenEmpty?: boolean
}

/**
 * ふりがなを自動で入力するためのSvelte Attachment
 *
 * @param options - オプション
 * @param options.mode - ひらがなかカタカナか (デフォルト: `hiragana`)
 *
 * @returns [かなを取得する元のinput用アタッチメント, 読み仮名を出力する先のinput用アタッチメント]
 *
 * @example
 * ```svelte
 * <script>
 *   import { createAutoKana } from 'svelte-autokana'
 *   const [nameKanji, nameKana] = createAutoKana()
 * </script>
 *
 * <input type="text" name="nameKanji" {@attach nameKanji} />
 * <input type="text" name="nameKana" {@attach nameKana} />
 * ```
 */
export function createAutoKana(
	options?: Options
): [
	attachmentForKanjiInput: Attachment<HTMLInputElement>,
	attachmentForKanaInput: Attachment<HTMLInputElement>,
] {
	const toKatakana = (matches: string[]): string[] => {
		return matches.map((char) => {
			return char === 'ー' ? char : String.fromCharCode(char.charCodeAt(0) + 96)
		})
	}

	let furigana = $state('')

	/** 変換済みのかな */
	let converted = ''

	/** 未確定のかな */
	let pending = ''

	return [
		/** かなを取得する元のinput用アタッチメント */
		(node: HTMLInputElement) => {
			$effect(() => {
				const controller = new AbortController()

				// ひらがなで入力中
				node.addEventListener(
					'compositionupdate',
					(e) => {
						const kana = e.data.match(/[ぁ-んー]/g) ?? []

						// 変換候補を選んでいる最中
						if (kana.length !== e.data.length) return

						pending = (options?.mode === 'katakana' ? toKatakana(kana) : kana).join('')
						furigana = converted + pending
					},
					{ signal: controller.signal }
				)

				// 変換確定
				node.addEventListener(
					'compositionend',
					() => {
						converted = furigana
						pending = ''
					},
					{ signal: controller.signal }
				)

				if (options?.clearWhenEmpty ?? true) {
					// 全部消したときは、かなも消す
					node.addEventListener(
						'input',
						() => {
							setTimeout(() => {
								if (node.value === '' && pending === '') {
									furigana = ''
									converted = ''
									pending = ''
								}
							}, 0)
						},
						{ signal: controller.signal }
					)
				}

				return () => controller.abort()
			})
		},

		/** フリガナを出力する先のinput用アタッチメント */
		(node: HTMLInputElement) => {
			$effect(() => {
				const controller = new AbortController()

				node.addEventListener(
					'input',
					() => {
						furigana = node.value
						converted = node.value
					},
					{ signal: controller.signal }
				)

				return () => controller.abort()
			})

			$effect(() => {
				if (node.value !== furigana) {
					node.value = furigana
				}
			})
		},
	]
}
