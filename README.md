# Awesome Redux Hook

> Note: This project is just an early idea, and it's not ready to go production. Api references listed below are on the fly, and it's not ready yet. If you are eager to make it come true, you are webcome to create a PR.

## Design Philosophy

Basically, the idea comes from those two libraries. But the philosophy is totally different, that why I created this library. Before we get started, I want to say thanks to [Daishi Kato](https://frontarm.com/daishi-kato/). During the solution validation phase,  he give me a lot of mind resource via his posts.

* [reactive-react-redux](https://github.com/dai-shi/reactive-react-redux)
* [redux-react-hook](https://github.com/facebookincubator/redux-react-hook)

**What are the sames with others?**

* Use hooks
* Redux echosystem

**What are the differences with others?**

* Encourage multiple store
* Encourage component level store
* Encourage component self-contained side effects
* Redux Saga build-in

**Why so many  encourages?**

Because this library will not force you take this pattern, but it will help you a lot if you want to create reusable component and reusable logic.

## Installation

**NPM**

```bash
npm i awesome-redux-hook --save
```

**YARN**

```bash
yarn add awesome-redux-hook
```

## Quick Start

Awesome Redux Hook (ARH) has been designed to be a minimal library to help you create reusable component but giant. For minimal, ARH only contains several lines of code that supply very few useful hooks. For giant, ARH will force you to use it with a react tool sets, those are `redux`, `react-redux`, `redux-saga`.

Here is an well known example about count numbers.

```tsx
import React, { useState } from 'react'
import { delay, put } from 'redux-saga/effects'
import { useLocalState } from 'awsome-redux-hook'

// Actions
const INCREMENT = 'INCREMENT'
const DECREMENT = 'DECREMENT'
const increment = () => ({
  type: INCREMENT,
} as const)
const decrement = () => ({
  type: DECREMENT,
} as const)
type Actions =
  | ReturnType<typeof increment>
  | ReturnType<typeof decrement>

// Reducer
const initialState = {
  count: 0,
}
function countReducer(state = initialState, action: Actions) {
  switch (action.type) {
    case INCREMENT:
      return { count: state.count + 1 }
    case DECREMENT:
      return { count: state.count - 1 }
    default:
      return initialState
  }
}

// Selector
const countSelector = (state: any) => state.count

// Saga
function* autoIncrease() {
  while (true) {
    yield delay(1000)
    yield put(increment())
  }
}

function Counter() {
  const { state, useAction, useSaga } = useLocalState(countReducer, initialState)
  const handlePlus = useAction(increment)
  const handleMinus = useAction(decrement)

  useSaga(autoIncrease)

  return (
    <>
      Count: {countSelector(state)}
      <button onClick={handlePlus}>+</button>
      <button onClick={handleMinus}>-</button>
    </>
  )
}
```

**How to reuse the logic with different looking?**

```tsx
export function useCount() {
  const { state, useAction, useSaga } = useLocalState(countReducer, initialState)
  const handlePlus = useAction(increment)
  const handleMinus = useAction(decrement)

  useSaga(autoIncrease)
  
  return {
    state: countSelector(state),
    handlers: {
      handlePlus,
      handleMinus
    }
  }
}
```

## API Reference

### useLocalState(reducer, [initialState], [enhancer])

Create a component level state like `useReducer` but behind of this, it will use redux store instead. 

**Arguments**

1. `reducer` *(Function)*: A [reducing function](https://redux.js.org/glossary#reducer) that returns the next [state tree](https://redux.js.org/glossary#state), given the current state tree and an [action](https://redux.js.org/glossary#action) to handle.
2. [`preloadedState`] *(any)*: The initial state. This can be a pre-defined state (const) or it can be computed from properties. If the initial state has been changed after component mounted, the old state will be dropped and adopt the new one.
3. [`enhancer`] *(Function)*: The store enhancer. You may optionally specify it to enhance the store with third-party capabilities such as middleware, time travel, persistence, etc. The `redux-saga` enhancer is always included by default.

**Returns**

1. `state`: A state object (might be) that computed by reducer. This value will keep update based on some Action has been fired by user or saga.
2. `useAction(actionCreator, [callback]):function`(*Function*): A helper hook that help you to create a memorized function that has the exactly signature with your actionCreator but with dispatch build-in. The second optional argument `callback` that accpets the same arguments with `actionCreator` . And it's designed to help the component know the action has been dispatched. In general, you can use it to let parent component know the same event has happened. 
3. `useSaga(saga, …args):void`(*Function*): A hook that will run saga after component mounted. Do not update saga after during component lifecycle. A suggested way is to put your saga generator out of component.

### usePersistentState(store, [selector])

Bring a global state to component level (Don't need provider any more). Just like the name, it's designed for some state that you may want to persist it until user closed the tab. For example, you have a shared CountryListSelect component and that options come from a JSON server. During the whole application lifecycle, you only want this API to call once, so, this is a best scenario to use the `usePersistentState`. Otherwise, use `useLocalState` as much as you can.

**Arguments**

1. `store`(*redux store instance*): An initialted redux store instance. For how to create a store, follow the redux doc, [createStore](https://redux.js.org/api/createstore).
2. [`selector`] (*function*): A selector function that help you to compute the final state. You can still use the library like [reselect](https://github.com/reduxjs/reselect) to help you memorize the state to reduce the heavy computation. If no selector provided, the component will update whenever the store has been changed.

**Returns**

1. `state`: A state object (might be) that returned from `store.getState`. If `selector` is provided, the state will be a return value of calling `selector(state)`.
2. `useAction(actionCreator, [callback]):function`(*Function*): A helper hook that similar with the `useLocalState`, but instead, the action is dispatched with the `store` that you provided in `usePersistentState`. (You may think the action can be bound out of the component. Yes, you are right. But the API will look weird when you compare with `useLocalState`)
3. `useSaga(saga, …args):void`(*Function*): A hook that will run saga after component mounted. A better place to register your component level saga (The saga will be cancel when component unmount). If you want you saga run only one instance at global level, you should register you saga to store level.

## Q & A

TODO

## What's next?

- [ ] Implement the APIs in api reference
- [ ] More unit tests
- [ ] More examples
- [ ] Benchmark for production ready
- [ ] Release

## How to contribute?

1. Create an issue and take it. (Reduce the duplicate work with others).
2. Fork, make changes, create a PR.
3. Merge!

## Contributors

[eavae](https://github.com/eavae)