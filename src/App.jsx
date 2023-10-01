import { Routes, Route } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import UserList from './components/users/usersLists/UserList'
import UserDetails from './components/users/userDetails/UserDetails'
import NotFound from './components/common/NotFound'

export default function App() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <a
        href="#main"
        className="sr-only rounded bg-forest px-4 py-2 font-bold text-card focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/user/:id" element={<UserDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}
