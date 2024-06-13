# svelte-autokana

ふりがなを自動で入力するためのSvelte Action

## Installation
```bash
npm i svelte-autokana
```

## Usage
```svelte
<script lang="ts">
    import { autoKana } from 'svelte-autokana'

    let kanaInput: HTMLInputElement
</script>

<label for="name">名前</label>
<input id="name" type="text" use:autoKana={{ kanaInput }} />

<label for="nameKana">名前（かな）</label>
<input id="nameKana" type="text" bind:this={kanaInput} />
```

## Parameters

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| kanaInput | `HTMLInputElement` | `undefined` | ふりがな用\<Input> |
| katakana | `boolean` | `false` | `true`の場合、出力はカタカナ |
