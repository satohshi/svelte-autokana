import type { Action } from 'svelte/action'

export interface Options {
	/** 読み仮名をカタカナで出力するか (デフォルト: `false`) */
	katakana?: boolean
	/** 元のinputを空にしたときに、かなも消すか (デフォルト: `true`) */
	clearWhenEmpty?: boolean
}

/**
 * ふりがなを自動で入力するためのSvelte Action
 *
 * @param options - オプション
 * @param options.katakana - 読み仮名をカタカナで出力するか (デフォルト: `false`)
 *
 * @returns [かなを取得する元のinput用アクション, 読み仮名を出力する先のinput用アクション]
 *
 * @example
 * ```svelte
 * <script>
 *   import { createAutoKana } from 'svelte-autokana'
 *   const [nameAction, kanaAction] = createAutoKana()
 * </script>
 *
 * <input use:nameAction type="text" name="name" />
 * <input use:kanaAction type="text" name="nameKana" />
 * ```
 */
export const createAutoKana = (
	options?: Options
): [Action<HTMLInputElement>, Action<HTMLInputElement>] => {
	let furigana = $state('')

	let converted = '' // 変換済みのかな
	let pending = '' // 未確定のかな

	return [
		// かなを取得する元のinput用アクション
		(node: HTMLInputElement) => {
			const toKatakana = (matches: string[]): string[] => {
				return matches.map((char) => {
					return char === 'ー' ? char : String.fromCharCode(char.charCodeAt(0) + 96)
				})
			}

			$effect(() => {
				const controller = new AbortController()

				// ひらがなで入力中
				node.addEventListener(
					'compositionupdate',
					(e) => {
						const kana = e.data.match(/[ぁ-んー]/g) ?? []

						// 変換候補を選んでいる最中
						if (kana.length !== e.data.length) return

						pending = (options?.katakana ? toKatakana(kana) : kana).join('')
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

		// フリガナを出力する先のinput用アクション
		(node: HTMLInputElement) => {
			$effect(() => {
				const controller = new AbortController()

				node.addEventListener('input', (): void => {
					furigana = node.value
					converted = node.value
				})

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
