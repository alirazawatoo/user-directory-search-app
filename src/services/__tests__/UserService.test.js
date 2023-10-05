import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { userService } from '../UserService'
import { urlsService } from '../UrlsService'

const originalFetch = global.fetch

describe('userService', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  afterEach(() => {
    global.fetch = originalFetch
    vi.resetAllMocks()
  })

  describe('getUsers', () => {
    it('fetches users with correct query params and maps response', async () => {
      const mockUsers = [{ id: 1, firstName: 'John', lastName: 'Doe' }]

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ users: mockUsers, total: 100 }),
      })

      const result = await userService.getUsers(2, 12)

      expect(global.fetch).toHaveBeenCalledWith(
        `${urlsService.users}?limit=12&skip=12`
      )

      expect(result).toEqual({
        users: mockUsers,
        page: 2,
        total: 100,
      })
    })

    it('throws a not found error message on 404', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({}),
      })

      await expect(userService.getUsers(1, 12)).rejects.toThrow(
        'Users data not found'
      )
    })

    it('throws a server-specific message on 500', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      })

      await expect(userService.getUsers(1, 12)).rejects.toThrow(
        'Temporary server issue. Please try again later.'
      )
    })

    it('propagates the underlying network error message', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(userService.getUsers(1, 12)).rejects.toThrow('Network error')
    })
  })

  describe('getSingleUser', () => {
    it('returns single user on success', async () => {
      const mockUser = { id: 1, firstName: 'John', lastName: 'Doe' }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockUser,
      })

      const result = await userService.getSingleUser(1)

      expect(global.fetch).toHaveBeenCalledWith(urlsService.user(1))
      expect(result).toEqual(mockUser)
    })

    it('throws a not found error message on 404', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({}),
      })

      await expect(userService.getSingleUser(123)).rejects.toThrow(
        'User not found'
      )
    })

    it('propagates the underlying network error message', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(userService.getSingleUser(1)).rejects.toThrow('Network error')
    })
  })
})

