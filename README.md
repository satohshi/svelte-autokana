# svelte-autokana

ふりがなを自動で入力するためのSvelte Action (Svelte 5.0.0+)

## Installation

```bash
npm i svelte-autokana
```

```bash
pnpm add svelte-autokana
```

## Usage

```svelte
<script lang="ts">
	import { createAutoKana } from 'svelte-autokana'

	const [nameAction, kanaAction] = createAutoKana()
</script>

<label for="name">名前</label>
<input id="name" type="text" use:nameAction />

<label for="nameKana">名前（かな）</label>
<input id="nameKana" type="text" use:kanaAction />
```

## Parameters

| Name           |   Type    | Default value | Description                                 |
| -------------- | :-------: | :-----------: | ------------------------------------------- |
| katakana       | `boolean` |    `false`    | `true`の場合、出力はカタカナ                |
| clearWhenEmpty | `boolean` |    `true`     | 元のinputを空にしたときに、かなも空にするか |
