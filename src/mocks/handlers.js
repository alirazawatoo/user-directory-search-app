import { http, HttpResponse } from 'msw/http'
import { urlsService } from '../services/UrlsService'
import { mockUsers } from './users'

// Mirrors the parts of the dummyjson.com /users API the app relies on:
// limit/skip paging, a { users, total, skip, limit } envelope and 404s.
const pageOf = (users, url) => {
  const limit = Number(url.searchParams.get('limit') ?? 30)
  const skip = Number(url.searchParams.get('skip') ?? 0)
  return {
    users: users.slice(skip, skip + limit),
    total: users.length,
    skip,
    limit,
  }
}

const matches = (user, term) =>
  [user.firstName, user.lastName, user.email].some((field) =>
    field.toLowerCase().includes(term)
  )

export const handlers = [
  http.get(urlsService.search, ({ request }) => {
    const url = new URL(request.url)
    const term = (url.searchParams.get('q') ?? '').trim().toLowerCase()
    return HttpResponse.json(pageOf(mockUsers.filter((user) => matches(user, term)), url))
  }),

  http.get(urlsService.users, ({ request }) =>
    HttpResponse.json(pageOf(mockUsers, new URL(request.url)))
  ),

  http.get(`${urlsService.users}/:id`, ({ params }) => {
    const user = mockUsers.find((candidate) => String(candidate.id) === params.id)
    if (!user) {
      return HttpResponse.json({ message: `User with id '${params.id}' not found` }, { status: 404 })
    }
    return HttpResponse.json(user)
  }),
]
