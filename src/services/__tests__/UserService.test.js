import { describe, it, expect, afterEach } from 'vitest'
import { http, HttpResponse, delay } from 'msw'
import { server } from '../../test/server'
import { userService } from '../UserService'
import { urlsService } from '../UrlsService'
import { mockUsers } from '../../mocks/users'

const recordRequests = () => {
  const urls = []
  server.events.on('request:start', ({ request }) => urls.push(request.url))
  return urls
}

describe('userService', () => {
  afterEach(() => server.events.removeAllListeners())

  describe('getUsers', () => {
    it('requests the page with limit/skip and maps the response', async () => {
      const urls = recordRequests()

      const result = await userService.getUsers({ page: 2, limit: 12 })

      expect(urls).toEqual([`${urlsService.users}?limit=12&skip=12`])
      expect(result).toEqual({
        users: mockUsers.slice(12, 24),
        total: mockUsers.length,
        query: '',
        page: 2,
      })
    })

    it('uses the search endpoint with a trimmed query', async () => {
      const urls = recordRequests()

      const result = await userService.getUsers({ query: '  rosa ', page: 1 })

      expect(urls).toEqual([`${urlsService.search}?limit=12&skip=0&q=rosa`])
      expect(result.users.map((user) => user.firstName)).toEqual(['Rosa'])
      expect(result.query).toBe('rosa')
    })

    it('throws a not found error with a code on 404', async () => {
      server.use(http.get(urlsService.users, () => new HttpResponse(null, { status: 404 })))

      await expect(userService.getUsers()).rejects.toMatchObject({
        message: 'Users data not found',
        code: 'not_found',
      })
    })

    it('throws a server-specific message on 500', async () => {
      server.use(http.get(urlsService.users, () => new HttpResponse(null, { status: 500 })))

      await expect(userService.getUsers()).rejects.toThrow(
        'Temporary server issue. Please try again later.'
      )
    })

    it('turns a network failure into a readable message', async () => {
      server.use(http.get(urlsService.users, () => HttpResponse.error()))

      await expect(userService.getUsers()).rejects.toThrow(
        'Could not reach the directory. Check your connection and try again.'
      )
    })

    it('rejects with an AbortError when the caller aborts', async () => {
      server.use(
        http.get(urlsService.users, async () => {
          await delay('infinite')
        })
      )
      const controller = new AbortController()

      const request = userService.getUsers({ signal: controller.signal })
      controller.abort()

      await expect(request).rejects.toMatchObject({ name: 'AbortError' })
    })
  })

  describe('getSingleUser', () => {
    it('returns a single user on success', async () => {
      await expect(userService.getSingleUser(1)).resolves.toEqual(mockUsers[0])
    })

    it('throws a not found error with a code on 404', async () => {
      await expect(userService.getSingleUser(999)).rejects.toMatchObject({
        message: 'User not found',
        code: 'not_found',
      })
    })
  })
})
