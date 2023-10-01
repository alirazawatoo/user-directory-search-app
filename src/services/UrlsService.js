const BASE_URL = 'https://dummyjson.com'

export const urlsService = {
  users: `${BASE_URL}/users`,
  search: `${BASE_URL}/users/search`,
  user: (id) => `${BASE_URL}/users/${id}`,
}
