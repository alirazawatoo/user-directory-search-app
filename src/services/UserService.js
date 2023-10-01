import { urlsService } from './UrlsService'

export const PAGE_SIZE = 12

const NETWORK_MESSAGE = 'Could not reach the directory. Check your connection and try again.'
const SERVER_MESSAGE = 'Temporary server issue. Please try again later.'

const httpError = (status, notFoundMessage, fallbackMessage) => {
  if (status === 404) {
    return Object.assign(new Error(notFoundMessage), { code: 'not_found' })
  }
  return new Error(status >= 500 ? SERVER_MESSAGE : fallbackMessage)
}

async function getJson(url, { signal, notFoundMessage, fallbackMessage }) {
  let response
  try {
    response = await fetch(url, { signal })
  } catch (error) {
    // An abort is the caller's decision, not a failure to report.
    if (error?.name === 'AbortError') throw error
    throw new Error(NETWORK_MESSAGE)
  }

  if (!response.ok) {
    throw httpError(response.status, notFoundMessage, fallbackMessage)
  }
  return response.json()
}

export const userService = {
  async getUsers({ query = '', page = 1, limit = PAGE_SIZE, signal } = {}) {
    const term = query.trim()
    const params = new URLSearchParams({
      limit: String(limit),
      skip: String((page - 1) * limit),
    })
    if (term) params.set('q', term)

    const data = await getJson(`${term ? urlsService.search : urlsService.users}?${params}`, {
      signal,
      notFoundMessage: 'Users data not found',
      fallbackMessage: 'Failed to fetch users. Please try again later.',
    })

    return {
      users: data.users ?? [],
      total: data.total ?? 0,
      query: term,
      page,
    }
  },

  getSingleUser(id, { signal } = {}) {
    return getJson(urlsService.user(id), {
      signal,
      notFoundMessage: 'User not found',
      fallbackMessage: 'Failed to fetch user details. Please try again later.',
    })
  },
}
