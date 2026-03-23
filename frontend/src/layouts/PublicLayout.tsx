import { Outlet } from 'react-router-dom'
import Navbar from '@components/common/Navbar'
import Footer from '@components/common/Footer'

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-nn-bg text-nn-on-surface">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
