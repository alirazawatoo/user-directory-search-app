import { describe, it, expect, vi, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw/http'
import { server } from '../../test/server'
import { userService } from '../UserService'
import { urlsService } from '../UrlsService'
import { mockUsers } from '../../mocks/users'

describe('userService', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('getUsers', () => {
    it('requests the page with limit/skip and maps the response', async () => {
      let requestedUrl
      server.events.on('request:start', ({ request }) => {
        requestedUrl = request.url
      })

      const result = await userService.getUsers(2, 12)

      expect(requestedUrl).toBe(`${urlsService.users}?limit=12&skip=12`)
      expect(result).toEqual({
        users: mockUsers.slice(12, 24),
        page: 2,
        total: mockUsers.length,
      })
      server.events.removeAllListeners()
    })

    it('throws a not found error message on 404', async () => {
      server.use(http.get(urlsService.users, () => new HttpResponse(null, { status: 404 })))

      await expect(userService.getUsers(1, 12)).rejects.toThrow('Users data not found')
    })

    it('throws a server-specific message on 500', async () => {
      server.use(http.get(urlsService.users, () => new HttpResponse(null, { status: 500 })))

      await expect(userService.getUsers(1, 12)).rejects.toThrow(
        'Temporary server issue. Please try again later.'
      )
    })

    it('rejects when the network request fails', async () => {
      server.use(http.get(urlsService.users, () => HttpResponse.error()))

      await expect(userService.getUsers(1, 12)).rejects.toThrow()
    })
  })

  describe('getSingleUser', () => {
    it('returns a single user on success', async () => {
      await expect(userService.getSingleUser(1)).resolves.toEqual(mockUsers[0])
    })

    it('throws a not found error message on 404', async () => {
      await expect(userService.getSingleUser(999)).rejects.toThrow('User not found')
    })
  })
})
