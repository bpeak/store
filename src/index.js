class Store {
	constructor(initialState = {}) {
		this._state = initialState
		this._events = new Map()
		this._emitQueue = new Set()
		this._guard = false
		// test
	}
	get(){
		return this._state
	}
	on(propPath, listener, isSync = false) {
		if(Array.isArray(propPath)) {
			propPath = propPath.map((v) => v.trim()).sort().join(",")
		}
		if(!this._events.has(propPath)) {
			this._events.set(propPath, [])
		}
		this._events.get(propPath).push(listener)

		if(isSync) {
			this._emitQueue.add(propPath)
			this._deferredUpdate(this._state, this._state)
		}
	}		
	set(state) {
		const prevState = {...this._state}
		const nextState = {...this._state, ...state}

		for(let propPath of this._events.keys()) {
			const prevValues = propPath.split(",").map(v => this._getValue(prevState, v))
			const nextValues = propPath.split(",").map(v => this._getValue(nextState, v))
			const isChangedValue = prevValues.some((v, i) => v !== nextValues[i])
			if(isChangedValue) {
				this._emitQueue.add(propPath)
			}
		}
		this._deferredUpdate(nextState, prevState)

	}	
	_getValue(state, propPath) { 
		return propPath.split(".").reduce((v, key) => v[key], state)
	}
	_emit(propPath, prevState) {
		const nextState = this._state
		this._events.get(propPath).forEach(listener => listener(nextState, prevState))
	}
	_deferredUpdate(nextState, prevState) {
		this._state = nextState
		if(!this._guard) {
			this._guard = true
			Promise.resolve().then(() => {
				this._guard = false
				this._emitQueue.forEach(propPath => {
					this._emit(propPath, prevState)
				})
				this._emitQueue = new Set()
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
store.on("person.name", (state, prevState) => {
	console.log("person.name changed")
}, true)

// Run as default state to match the sync.
store.on("isMenuOpen", (state, prevState) => {
	console.log(`isMenuOpen changed [prev:${prevState.isMenuOpen}] => [next:${state.isMenuOpen}]`)
}, true)

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
