// Fictional people for tests and the offline demo. Emails use example.com and
// phone numbers sit in the 555-01xx range reserved for fiction.
const FIRST_NAMES = [
  'Amara', 'Bastian', 'Chiara', 'Dmitri', 'Esme', 'Farid', 'Greta', 'Hiroshi',
  'Ines', 'Jonas', 'Kalani', 'Lucia', 'Mateo', 'Nadia', 'Oskar', 'Priya',
  'Quentin', 'Rosa', 'Soren', 'Talia', 'Umar', 'Vera', 'Wren', 'Ximena',
  'Yusuf', 'Zoe', 'Elio', 'Marta', 'Noor', 'Felix',
]

const LAST_NAMES = [
  'Okafor', 'Lindqvist', 'Moretti', 'Petrov', 'Hale', 'Haddad', 'Brandt',
  'Tanaka', 'Duarte', 'Weber', 'Kealoha', 'Ferraro', 'Ibarra', 'Rahman',
  'Nyberg', 'Iyer', 'Marchand', 'Delgado', 'Holm', 'Navarro', 'Siddiqui',
  'Kovacs', 'Ashby', 'Robles', 'Demir', 'Fischer', 'Conti', 'Sousa', 'Aziz',
  'Lange',
]

const COMPANIES = [
  { name: 'Copperline Studio', city: 'Portland', state: 'Oregon', postalCode: '97201' },
  { name: 'Fernhill Labs', city: 'Madison', state: 'Wisconsin', postalCode: '53703' },
  { name: 'Quillstone Press', city: 'Savannah', state: 'Georgia', postalCode: '31401' },
  { name: 'Brightwater Freight', city: 'Tacoma', state: 'Washington', postalCode: '98402' },
  { name: 'Saltmarsh Analytics', city: 'Charleston', state: 'South Carolina', postalCode: '29401' },
]

const DEPARTMENTS = ['Engineering', 'Support', 'Marketing', 'Finance', 'Research', 'Operations']
const TITLES = ['Analyst', 'Team Lead', 'Designer', 'Engineer', 'Coordinator', 'Manager', 'Specialist']

export const mockUsers = FIRST_NAMES.map((firstName, index) => {
  const lastName = LAST_NAMES[index]
  const company = COMPANIES[index % COMPANIES.length]
  return {
    id: index + 1,
    firstName,
    lastName,
    email: `${firstName}.${lastName}@example.com`.toLowerCase(),
    phone: `+1 555-01${String(index + 10).padStart(2, '0')}`,
    company: {
      name: company.name,
      department: DEPARTMENTS[index % DEPARTMENTS.length],
      title: TITLES[index % TITLES.length],
      address: {
        address: `${100 + index * 7} Market Street`,
        city: company.city,
        state: company.state,
        postalCode: company.postalCode,
      },
    },
  }
})
