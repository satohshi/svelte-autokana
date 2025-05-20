# svelte-autokana

ふりがなを自動で入力するためのSvelte Attachment

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

    const [nameKanji, nameKana] = createAutoKana()
</script>

<label for="name">名前</label>
<input id="nameKanji" type="text" {@attach nameKanji} />

<label for="nameKana">名前（かな）</label>
<input id="nameKana" type="text" {@attach nameKana} />
```

## Parameters

| Name           |   Type    | Default value | Description                                 |
| -------------- | :-------: | :-----------: | ------------------------------------------- |
| katakana       | `boolean` |    `false`    | `true`の場合、出力はカタカナ                |
| clearWhenEmpty | `boolean` |    `true`     | 元のinputを空にしたときに、かなも空にするか |
