import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store/Store.js'
import './index.css'
import App from './App.jsx'

// `--mode mock` serves the fictional people from src/mocks through a service
// worker, so the app runs without the network. Other builds drop this code.
async function startMockApi() {
  if (import.meta.env.MODE !== 'mock') return
  const { worker } = await import('./mocks/browser.js')
  await worker.start({ onUnhandledRequest: 'bypass', quiet: true })
}

startMockApi().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </StrictMode>,
  )
})
