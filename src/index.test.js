import Store from './index'

const store = new Store({
	boards: [1,2,3,4],
	person: {
		name: "kihyun",
	},
	isMenuOpen: false,
})

store.on("boards", (state, prevState) => {
	console.log(`boards changed [boards:${state.boards}]`)
})

store.on("boards.length", (state, prevState) => {
	console.log("boards.length changed")
})

// Run as default state to match the sync.
store.onAndSync("person.name", (state, prevState) => {
	console.log(`person.name changed [prev:${prevState.person.name}] => [next:${state.person.name}]`)
})

// Run as default state to match the sync.
store.onAndSync("isMenuOpen", (state, prevState) => {
	console.log(`isMenuOpen changed [prev:${prevState.isMenuOpen}] => [next:${state.isMenuOpen}]`)
})

store.on(['isMenuOpen', 'boards', 'boards.length'], (state) => {
	console.log('whatever changed')
})

setTimeout(() => {
	// update isMenuOpen
	store.set({
		isMenuOpen: true
	})
}, 2000)

setTimeout(() => {
	// not triggered ( because prevState and nextState are the same )
	store.set({
		isMenuOpen: true
	})
}, 4000)

setTimeout(() => {
	// "boards" triggerd but "boards.length" not triggered
	store.set({
		boards: [4,3,2,1]
	})
}, 6000)

setTimeout(() => {
	// set four times, but only updated once ( because of defferedUpdate )
	store.set({
		boards: [1]
	})
	store.set({
		boards: [1,2]
	})
	store.set({
		boards: [1,2,3]
	})
	store.set({
		boards: [1,2,3,4,5,6,8,9,10]
	})
}, 8000)