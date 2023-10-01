import { urlsService } from './UrlsService'

const mapHttpStatusToMessage = (status, notFoundMessage, genericMessage) => {
  if (status === 404) {
    return notFoundMessage
  }
  if (status >= 500) {
    return 'Temporary server issue. Please try again later.'
  }
  return genericMessage
}

const normalizeUnknownError = (error, fallbackMessage) => {
  if (error instanceof Error && error.message) {
    return error.message
  }
  return fallbackMessage
}

export const userService = {
  async getUsers(page = 1, limit = 12) {
    try {
      const skip = (page - 1) * limit
      const response = await fetch(
        `${urlsService.users}?limit=${limit}&skip=${skip}`
      )

      if (response.ok) {
        const data = await response.json()
        return {
          users: data.users ?? [],
          page,
          total: data.total ?? 0,
        }
      }

      const message = mapHttpStatusToMessage(
        response.status,
        'Users data not found',
        'Failed to fetch users. Please try again later.'
      )
      throw new Error(message)
    } catch (error) {
      console.error('Error fetching users:', error)
      const message = normalizeUnknownError(
        error,
        'Failed to fetch users. Please try again later.'
      )
      throw new Error(message)
    }
  },

  async getSingleUser(id) {
    try {
      const response = await fetch(urlsService.user(id))

      if (response.ok) {
        return await response.json()
      }

      const message = mapHttpStatusToMessage(
        response.status,
        'User not found',
        'Failed to fetch user details. Please try again later.'
      )
      throw new Error(message)
    } catch (error) {
      console.error('Error fetching user:', error)
      const message = normalizeUnknownError(
        error,
        'Failed to fetch user details. Please try again later.'
      )
      throw new Error(message)
    }
  },
}
