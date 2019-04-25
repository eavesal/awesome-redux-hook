import Layout from 'antd/lib/layout'
import React from 'react'
import { Route } from 'react-router'
import { all, takeEvery } from 'redux-saga/effects'
import { useLocalState } from '../../../../src'
import { Explore } from '../component/Explore'
import { history } from '../service'
import { RepoPage } from './RepoPage'
import { UserPage } from './UserPage'

const { Header, Content, Footer, Sider } = Layout

export const NAVIGATE = 'NAVIGATE'

const navigate = (pathname: string) =>
  ({
    type: NAVIGATE,
    payload: pathname,
  } as const)

const initialState = {}
type NavigateAction = ReturnType<typeof navigate>
type Actions = NavigateAction
function appReducer(state: typeof initialState, action: Actions) {
  switch (action.type) {
    default:
      return state
  }
}

function* appSaga() {
  yield all([
    takeEvery(NAVIGATE, function({ payload }: NavigateAction) {
      history.push(payload)
    }),
  ])
}

interface IAppProps {
  errorMessage?: string
  onResetErrorMessage(): void
}
export function App({ errorMessage, onResetErrorMessage }: IAppProps) {
  const { useAction, useSaga } = useLocalState(appReducer, {})
  const handleNavigation = useAction(navigate)
  useSaga(appSaga)
  return (
    <Layout>
      <Header>header</Header>
      <Layout>
        <Sider />
        <Content>
          <Explore onSubmit={value => handleNavigation(`/${value}`)} />
          <hr />
          {errorMessage && (
            <p style={{ backgroundColor: '#e99', padding: 10 }}>
              <b>{errorMessage}</b> (
              <a href="#" onClick={onResetErrorMessage}>
                Dismiss
              </a>
              )
            </p>
          )}
          <Route path="/:login" component={UserPage} />
          <Route path="/:login/:name" component={RepoPage} />
        </Content>
        <Sider />
      </Layout>
      <Footer>footer</Footer>
    </Layout>
  )
}
