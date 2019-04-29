import { Reducer, useCallback, useEffect, useRef, useState } from 'react'
import { Action } from 'redux'
import { runSaga, Saga, stdChannel, Task } from 'redux-saga'

export function useLocalState<State, Actions extends Action>(
  reducer: Reducer<State, Actions>,
  initialState: State
) {
  const [state, setState] = useState(initialState)
  const channelRef = useRef(stdChannel<Actions>())
  const storeRef = useRef(initialState)
  const taskRef = useRef<Task>()

  const dispatch = useCallback(
    (action: Actions) => {
      const newState = reducer(storeRef.current, action)
      storeRef.current = newState
      setState(newState)

      channelRef.current.put(action)

      return action
    },
    [reducer]
  )

  const sagaOptions = {
    channel: channelRef.current,
    dispatch,
    getState: () => storeRef.current,
  }
  function useSaga<SA extends Saga>(saga: SA, ...args: Parameters<SA>) {
    useEffect(() => {
      taskRef.current && taskRef.current.cancel()
      taskRef.current = runSaga(sagaOptions, saga, ...args)
      return () => {
        taskRef.current && taskRef.current.cancel()
      }
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
