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