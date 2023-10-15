export const filterUsersByName = (users, searchTerm) => {
  if (!Array.isArray(users)) {
    return []
  }

  if (users.length === 0) {
    return []
  }

  const normalizedSearch = searchTerm?.trim().toLowerCase()

  if (!normalizedSearch) {
    return users
  }

  return users.filter((user) => {
    const firstName = user.firstName ?? ''
    const lastName = user.lastName ?? ''

    const fullName = `${firstName} ${lastName}`.trim().toLowerCase()

    if (!fullName) {
      return false
    }

    return fullName.includes(normalizedSearch)
  })
}