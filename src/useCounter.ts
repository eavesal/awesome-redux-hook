import { useLocalState } from './useLocalState'

// Actions
const INCREMENT = 'INCREMENT'
const DECREMENT = 'DECREMENT'
const UPDATE = 'UPDATE'
const increment = () =>
  ({
    type: INCREMENT,
  } as const)
const decrement = () =>
  ({
    type: DECREMENT,
  } as const)
const update = (count: number) =>
  ({
    type: UPDATE,
    payload: count,
  } as const)
type Actions =
  | ReturnType<typeof increment>
  | ReturnType<typeof decrement>
  | ReturnType<typeof update>

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
    case UPDATE:
      return { count: action.payload }
    default:
      return initialState
  }
}

// Selector
const countSelector = (state: any) => state.count

export function useCounter(
  defaultCount: number,
  onChange: (count: number) => void
) {
  const { state, useAction, useSaga } = useLocalState(countReducer, {
    count: defaultCount,
  })
  const count = countSelector(state)

  const handlePlus = useAction(increment)
  const handleMinus = useAction(decrement)
  const handleChange = useAction(update, onChange)

  return {
    count,
    handleChange,
    handlePlus,
    handleMinus,
  }
}
