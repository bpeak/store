class Store {
	constructor(initialState = {}) {
		this._state = initialState
		this._events = new Map()
		this._guard = false
		this._currTicklisteners = new Set()
	}
	on(props, listener) {
		if(!Array.isArray(props)) {
			props = [props]
		}
		props.forEach(prop => {
			if(!this._events.has(prop)){ this._events.set(prop, []) }
			this._events.get(prop).push(listener)
		})
		return props
	}
	onAndSync(props, listener) { 
		props = this.on(props, listener)
		this._deferredUpdate(props, this._state, this._state)
	}
	get(){
		return this._state
	}
	set(state) {
		const prevState = {...this._state}
		const nextState = {...this._state, ...state}

		const changedProps = [...this._events.keys()].filter(prop => {
			const prevValue = this._getValue(prevState, prop)
			const nextValue = this._getValue(nextState, prop)
			const isChanged = prevValue !== nextValue
			return isChanged
		})

		if(changedProps.length >= 1){
			this._deferredUpdate(changedProps, nextState, prevState)	
		}
	}	
	_getValue(state, prop) { 
		return prop.split(".").reduce((v, key) => v[key], state)
	}
	_deferredUpdate(props, nextState, prevState) {
		this._state = nextState
		props.forEach(prop => {
			[...this._events.get(prop).values()].forEach(listener => {
				this._currTicklisteners.add(listener)
			})
		})
		if(!this._guard) {
			this._guard = true
			Promise.resolve().then(() => {
				this._guard = false
				const nextState = this._state
				this._currTicklisteners.forEach(listener => listener(nextState, prevState))
				this._currTicklisteners.clear()
			})
		}
	}
}

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
