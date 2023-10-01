const BASE_URL = 'https://dummyjson.com'

export const urlsService = {
    users: `${BASE_URL}/users`,
    user: (id) => `${BASE_URL}/users/${id}`
}