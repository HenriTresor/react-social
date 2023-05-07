import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import store from './redux/store.js'
import { Provider } from 'react-redux'
import { HashRouter as Router } from 'react-router-dom'
import '@fontsource/roboto/500.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
)
