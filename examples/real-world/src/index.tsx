import 'antd/dist/antd.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { Route, Router } from 'react-router-dom'
import { App } from './container/App'
import './index.html'
import { history } from './service'

ReactDOM.render(
  <Router history={history}>
    <Route path="/" component={App} />
  </Router>,
  document.getElementById('root') as HTMLElement
)
