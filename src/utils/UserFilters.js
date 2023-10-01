export const filterUsersByName = (users, searchTerm) => {
  if (!Array.isArray(users) || users.length === 0) {
    return []
  }

  const normalizedSearch = searchTerm?.trim().toLowerCase()

  if (!normalizedSearch) {
    return users
  }

  return users.filter((user) => {
    const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`
      .trim()
      .toLowerCase()

    if (!fullName) {
      return false
    }

    return fullName.includes(normalizedSearch)
  })
}