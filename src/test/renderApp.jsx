import { useEffect } from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter, useLocation } from 'react-router-dom'
import App from '../App'
import { makeStore } from '../store/Store'

export const locationRef = { current: null }

function LocationProbe() {
  const location = useLocation()
  useEffect(() => {
    locationRef.current = location
  }, [location])
  return null
}

export function renderApp(initialEntry = '/') {
  const user = userEvent.setup()
  const view = render(
    <Provider store={makeStore()}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <App />
        <LocationProbe />
      </MemoryRouter>
    </Provider>
  )
  return { user, ...view }
}

export const currentUrl = () => `${locationRef.current.pathname}${locationRef.current.search}`
