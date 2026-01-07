import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './App'
import './index.css' // Contient les directives Tailwind

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Le Provider permet à tous les composants d'accéder aux hooks RTK Query */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)