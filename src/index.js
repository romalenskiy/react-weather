import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch, faSyncAlt } from '@fortawesome/free-solid-svg-icons'

import './index.scss'
import { App } from './components/App'
import * as serviceWorker from './serviceWorker'

library.add(faSearch, faSyncAlt)

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root'),
)

if (module.hot) {
  module.hot.accept()
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
