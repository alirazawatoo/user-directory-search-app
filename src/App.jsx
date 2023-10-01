import { Routes, Route } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import UserList from './components/users/usersLists/UserList'
import UserDetails from './components/users/userDetails/UserDetails'
import NotFound from './components/common/NotFound'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/user/:id" element={<UserDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}
