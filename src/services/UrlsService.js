// dummyjson.com is a public demo API. Point VITE_API_BASE_URL at any service
// with the same /users contract to use other data.
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://dummyjson.com').replace(/\/+$/, '')

export const urlsService = {
  users: `${BASE_URL}/users`,
  search: `${BASE_URL}/users/search`,
  user: (id) => `${BASE_URL}/users/${id}`,
}
