# Store
> Store is a simple state-based event emitter

## Example
```js
const store = new Store({
	names: ['kihyun', 'jihyung'],
    isMenuOpen: false,
})

store.on('names', () => {
    console.log(`names changed: ${store.get().names}`)
})

store.on('isMenuOpen', () => {
    console.log(`isMenuOpen changed: ${store.get().isMenuOpen}`)
})

store.set({
    names: ['kihyun', 'jihyung', 'iksu', 'dongeun'],
    isMenuOpen: true
})
```

```
>> output
names changed: ['kihyun', 'jihyung', 'iksu', 'dongeun']
isMenuOpen changed: true
```

## Installation
```bash
$ npm install @bpeak/store
```
```js
const Store = require('@bpeak/store');
const store = new Store();
```

## UMD
```html
<script src="https://unpkg.com/@bpeak/store"></script>
<script>
    const store = new Store();
</script>
```

## ESM
```html
<script type="module">
    import Store from 'https://unpkg.com/@bpeak/store/dist/index.esm.js'
    const store = new Store();
</script>
```

## API

## Licence
MIT