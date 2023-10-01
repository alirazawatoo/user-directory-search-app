import { describe, it, expect } from 'vitest'
import { filterUsersByName } from '../UserFilters'

const createUser = (firstName, lastName) => ({ firstName, lastName })

describe('filterUsersByName', () => {
  it('returns empty array when users is not an array', () => {
    expect(filterUsersByName(null, 'john')).toEqual([])
    expect(filterUsersByName(undefined, 'john')).toEqual([])
  })

  it('returns all users when searchTerm is empty or whitespace', () => {
    const users = [createUser('John', 'Doe'), createUser('Jane', 'Smith')]

    expect(filterUsersByName(users, '')).toEqual(users)
    expect(filterUsersByName(users, '   ')).toEqual(users)
    expect(filterUsersByName(users, null)).toEqual(users)
  })

  it('filters by full name, case-insensitive', () => {
    const users = [
      createUser('John', 'Doe'),
      createUser('Jane', 'Smith'),
      createUser('Alice', 'Johnson'),
    ]

    expect(filterUsersByName(users, 'john doe')).toEqual([
      createUser('John', 'Doe'),
    ])
    expect(filterUsersByName(users, 'JOHN')).toEqual([
      createUser('John', 'Doe'),
      createUser('Alice', 'Johnson'),
    ])
  })

  it('handles extra spaces in search term', () => {
    const users = [createUser('John', 'Doe'), createUser('Johanna', 'Doe')]

    expect(filterUsersByName(users, '  john   ')).toEqual([
      createUser('John', 'Doe'),
    ])
  })

  it('skips users with missing names', () => {
    const users = [
      createUser('John', 'Doe'),
      createUser(null, null),
      createUser('', 'Smith'),
    ]

    expect(filterUsersByName(users, 'smith')).toEqual([
      createUser('', 'Smith'),
    ])
  })
})

