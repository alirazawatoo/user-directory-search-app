import { describe, it, expect, afterEach } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse, delay } from 'msw'
import { server } from '../../../../test/server'
import { renderApp, currentUrl } from '../../../../test/renderApp'
import { urlsService } from '../../../../services/UrlsService'
import { mockUsers } from '../../../../mocks/users'

const searchRequests = () => {
  const terms = []
  server.events.on('request:start', ({ request }) => {
    const url = new URL(request.url)
    if (url.pathname.endsWith('/search')) terms.push(url.searchParams.get('q'))
  })
  return terms
}

const cardNames = () =>
  within(screen.getByRole('list', { name: 'People' }))
    .getAllByRole('link')
    .map((link) => link.textContent)

describe('UserList', () => {
  afterEach(() => server.events.removeAllListeners())

  it('loads the first page and summarises the range', async () => {
    renderApp('/')

    expect(await screen.findByText('Showing 1–12 of 30 people')).toBeInTheDocument()
    expect(cardNames()).toHaveLength(12)
    expect(cardNames()[0]).toBe('Amara Okafor')
  })

  it('debounces typing into one search and mirrors it in the URL', async () => {
    const terms = searchRequests()
    const { user } = renderApp('/')
    await screen.findByText('Showing 1–12 of 30 people')

    await user.type(screen.getByRole('searchbox', { name: 'Search by name or email' }), 'nadia')

    expect(await screen.findByText('Showing 1–1 of 1 person matching “nadia”')).toBeInTheDocument()
    expect(terms).toEqual(['nadia'])
    expect(currentUrl()).toBe('/?q=nadia')
    expect(cardNames()).toEqual(['Nadia Rahman'])
  })

  it('shows the newest search even when an older response arrives later', async () => {
    server.use(
      http.get(urlsService.search, async ({ request }) => {
        const term = new URL(request.url).searchParams.get('q')
        if (term === 'ro') await delay(400)
        const matches = mockUsers.filter((person) => person.firstName.toLowerCase().includes(term))
        return HttpResponse.json({ users: matches, total: matches.length, skip: 0, limit: 12 })
      })
    )
    const terms = searchRequests()
    const { user } = renderApp('/')
    const input = screen.getByRole('searchbox', { name: 'Search by name or email' })

    await user.type(input, 'ro')
    await waitFor(() => expect(terms).toEqual(['ro']))
    await user.type(input, 'sa')

    expect(await screen.findByText('Showing 1–1 of 1 person matching “rosa”')).toBeInTheDocument()
    await delay(500)
    expect(cardNames()).toEqual(['Rosa Delgado'])
  })

  it('restores the search and page from the URL', async () => {
    renderApp('/?q=example.com&page=2')

    expect(await screen.findByText('Showing 13–24 of 30 people matching “example.com”')).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: 'Search by name or email' })).toHaveValue('example.com')
  })

  it('pages forward and back with links and moves focus to the results heading', async () => {
    const { user } = renderApp('/')
    await screen.findByText('Showing 1–12 of 30 people')
    const pager = screen.getByRole('navigation', { name: 'Pagination' })
    expect(within(pager).queryByRole('link', { name: 'Previous' })).not.toBeInTheDocument()

    await user.click(within(pager).getByRole('link', { name: 'Next' }))

    expect(await screen.findByText('Showing 13–24 of 30 people')).toBeInTheDocument()
    expect(currentUrl()).toBe('/?page=2')
    expect(screen.getByRole('heading', { level: 1, name: 'People' })).toHaveFocus()

    await user.click(screen.getByRole('link', { name: 'Next' }))
    expect(await screen.findByText('Showing 25–30 of 30 people')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Next' })).not.toBeInTheDocument()
    expect(screen.getByText('Page 3 of 3')).toBeInTheDocument()
  })

  it('starts a new search from the first page', async () => {
    const { user } = renderApp('/?page=2')
    await screen.findByText('Showing 13–24 of 30 people')

    await user.type(screen.getByRole('searchbox', { name: 'Search by name or email' }), 'zoe{Enter}')

    expect(await screen.findByText('Showing 1–1 of 1 person matching “zoe”')).toBeInTheDocument()
    expect(currentUrl()).toBe('/?q=zoe')
  })

  it('explains a page number past the end and links to the last page', async () => {
    const { user } = renderApp('/?page=9')

    expect(await screen.findByText('Page 9 is past the end of these results.')).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Go to the last page (3)' }))
    expect(await screen.findByText('Showing 25–30 of 30 people')).toBeInTheDocument()
  })

  it('shows an empty state that can clear the search', async () => {
    const { user } = renderApp('/?q=zzz')

    expect(await screen.findByText('No one matches “zzz”.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear search' }))

    expect(await screen.findByText('Showing 1–12 of 30 people')).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: 'Search by name or email' })).toHaveValue('')
    expect(currentUrl()).toBe('/')
  })

  it('clears the search with Escape', async () => {
    const { user } = renderApp('/?q=rosa')
    await screen.findByText('Showing 1–1 of 1 person matching “rosa”')

    await user.click(screen.getByRole('searchbox', { name: 'Search by name or email' }))
    await user.keyboard('{Escape}')

    expect(await screen.findByText('Showing 1–12 of 30 people')).toBeInTheDocument()
    expect(currentUrl()).toBe('/')
  })

  it('shows a loading state, then an error that can be retried', async () => {
    let calls = 0
    server.use(
      http.get(urlsService.users, async () => {
        calls += 1
        await delay(50)
        if (calls === 1) return new HttpResponse(null, { status: 503 })
        return HttpResponse.json({ users: mockUsers.slice(0, 12), total: 30, skip: 0, limit: 12 })
      })
    )
    const { user } = renderApp('/')

    expect(await screen.findByText('Loading people…', { selector: '[role=status]' })).toBeInTheDocument()
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Temporary server issue. Please try again later.')

    await user.click(within(alert).getByRole('button', { name: 'Try again' }))

    expect(await screen.findByText('Showing 1–12 of 30 people')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
