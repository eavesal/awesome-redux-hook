import { Reducer, useCallback, useMemo, useRef, useState } from 'react'
import { Action } from 'redux'
import { runSaga, Saga, stdChannel } from 'redux-saga'

export function useLocalState<State, Actions extends Action>(
  reducer: Reducer<State, Actions>,
  initialState: State
) {
  const [state, setState] = useState(initialState)
  const { current: channel } = useRef(stdChannel<Actions>())
  const store = useRef(state)

  const dispatch = useCallback(
    (action: Actions) => {
      const newState = reducer(store.current, action)
      store.current = newState
      setState(newState)

      channel.put(action)

      return action
    },
    [reducer]
  )

  function useSaga<SA extends Saga>(saga: SA, ...args: Parameters<SA>) {
    useMemo(() => {
      runSaga(
        {
          context: {},
          channel,
          dispatch,
          getState: () => store.current,
        },
        saga,
        ...args
      )
    }, [saga, args])
  }

  function useAction<T extends any[]>(
    actionCreator: (...args: T) => Actions,
    callback?: (...args: T) => void
  ) {
    return (...args: T) => {
      dispatch(actionCreator(...args))
      if (typeof callback === 'function') {
        callback(...args)
      }
    }
  }

  return { state, useAction, useSaga }
}
