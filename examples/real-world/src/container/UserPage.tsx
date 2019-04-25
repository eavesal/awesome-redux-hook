import head from 'ramda/es/head'
import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router'
import { all, delay, fork, put, takeEvery } from 'redux-saga/effects'
import { useLocalState } from '../../../../src'
import { IUser, User } from '../component/User'

// Actions
const LOAD_USER_PAGE = 'LOAD_USER_PAGE'
const LOAD_USER_PAGE_SUCCEED = 'LOAD_USER_PAGE_SUCCEED'
const loadUserPage = (login: string, requiredFields = []) =>
  ({
    type: LOAD_USER_PAGE,
    payload: { login, requiredFields },
  } as const)
const loadUserSucceed = (users: IUser[]) =>
  ({
    type: LOAD_USER_PAGE_SUCCEED,
    payload: users,
  } as const)
type LoadUserPageAction = ReturnType<typeof loadUserPage>
type LoadUserSucceedAction = ReturnType<typeof loadUserSucceed>
type Actions = LoadUserPageAction | LoadUserSucceedAction

// Reducer
const initialState = {
  users: [] as IUser[],
}
function reducer(state: typeof initialState, action: Actions) {
  switch (action.type) {
    case LOAD_USER_PAGE_SUCCEED:
      return { ...state, users: action.payload }
    default:
      return state
  }
}

// Saga
function* loadUser(login: string, requiredFields = []) {
  yield delay(5000)
  yield put(
    loadUserSucceed([
      {
        login: 'eavae',
        avatarUrl: 'https://avatars2.githubusercontent.com/u/4454824?s=40&v=4',
        name: 'eavae',
      },
    ])
  )
}
function* saga() {
  yield all([
    takeEvery(LOAD_USER_PAGE, function*({
      payload: { login, requiredFields },
    }: LoadUserPageAction) {
      yield fork(loadUser, login, requiredFields)
    }),
  ])
}

export const selectUsers = (state: typeof initialState) => state.users

interface IUserPageProps extends RouteComponentProps<{ login: string }> {
  onLoadMore(): void
}

export function UserPage({ match }: IUserPageProps) {
  const { state, useAction, useSaga } = useLocalState(reducer, initialState)
  const handleLoadUser = useAction(loadUserPage)
  const login = match.params.login

  useSaga(saga)

  useEffect(() => {
    if (login) {
      handleLoadUser(login)
    }
  }, [login])

  const users = selectUsers(state)
  const user = head(users)

  return <div>{user && <User user={user} />}</div>
}
