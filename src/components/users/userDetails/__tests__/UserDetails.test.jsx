import { describe, it, expect, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '../../../../test/server'
import { renderApp, currentUrl } from '../../../../test/renderApp'
import { urlsService } from '../../../../services/UrlsService'
import { mockUsers } from '../../../../mocks/users'

const nadia = mockUsers.find((person) => person.firstName === 'Nadia')

describe('UserDetails', () => {
  afterEach(() => server.events.removeAllListeners())

  it('shows the profile and moves focus to the name', async () => {
    renderApp(`/user/${nadia.id}`)

    const heading = await screen.findByRole('heading', { level: 1, name: 'Nadia Rahman' })
    expect(heading).toHaveFocus()
    expect(screen.getByRole('link', { name: nadia.email })).toHaveAttribute('href', `mailto:${nadia.email}`)
    expect(screen.getByText(nadia.company.name)).toBeInTheDocument()
    expect(screen.getByText('Tacoma, Washington, 98402')).toBeInTheDocument()
  })

  it('reports a missing person instead of spinning forever', async () => {
    renderApp('/user/999')

    expect(await screen.findByRole('heading', { name: 'Person not found' })).toBeInTheDocument()
  })

  it('treats a non-numeric id as not found without calling the API', async () => {
    const urls = []
    server.events.on('request:start', ({ request }) => urls.push(request.url))
    renderApp('/user/abc')

    expect(await screen.findByRole('heading', { name: 'Person not found' })).toBeInTheDocument()
    expect(urls).toEqual([])
  })

  it('offers a retry when the server fails', async () => {
    let calls = 0
    server.use(
      http.get(`${urlsService.users}/:id`, () => {
        calls += 1
        return calls === 1 ? new HttpResponse(null, { status: 500 }) : HttpResponse.json(nadia)
      })
    )
    const { user } = renderApp(`/user/${nadia.id}`)

    expect(await screen.findByRole('alert')).toHaveTextContent('Temporary server issue')
    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Nadia Rahman' })).toBeInTheDocument()
  })

  it('copes with a profile that has no company or address', async () => {
    server.use(
      http.get(`${urlsService.users}/:id`, () =>
        HttpResponse.json({ id: 5, firstName: 'Esme', lastName: 'Hale', email: '', phone: '' })
      )
    )
    renderApp('/user/5')

    expect(await screen.findByRole('heading', { level: 1, name: 'Esme Hale' })).toBeInTheDocument()
    expect(screen.getByText('No company on record.')).toBeInTheDocument()
    expect(screen.getAllByText('Not listed')).toHaveLength(2)
  })

  it('goes back to the same search and page the profile was opened from', async () => {
    const { user } = renderApp('/?q=example.com&page=2')
    await user.click(await screen.findByRole('link', { name: 'Nadia Rahman' }))
    await screen.findByRole('heading', { level: 1, name: 'Nadia Rahman' })

    await user.click(screen.getByRole('link', { name: '← Back to people' }))

    expect(await screen.findByText('Showing 13–24 of 30 people matching “example.com”')).toBeInTheDocument()
    expect(currentUrl()).toBe('/?q=example.com&page=2')
  })

  it('renders a not-found page for unknown routes', async () => {
    renderApp('/nowhere')

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})
