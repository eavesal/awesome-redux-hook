import { act, renderHook } from 'react-hooks-testing-library'
import { useCounter } from './useCounter'

test('should initialize state by 0', () => {
  const { result } = renderHook(() => useCounter(0, () => {}))

  expect(result.current.count).toBe(0)
})

test('should increase correctly', () => {
  const { result } = renderHook(() => useCounter(0, () => {}))

  act(() => result.current.handlePlus())

  expect(result.current.count).toBe(1)
})

test('should decrease correctly', () => {
  const { result } = renderHook(() => useCounter(0, () => {}))

  act(() => result.current.handleMinus())

  expect(result.current.count).toBe(-1)
})
