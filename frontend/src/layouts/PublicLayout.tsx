import { Outlet } from 'react-router-dom'
import Navbar from '@components/common/Navbar'
import Footer from '@components/common/Footer'

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-nn-bg text-nn-on-surface">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-nn-primary focus:text-nn-bg focus:rounded-lg focus:text-sm"
      >
        본문으로 건너뛰기
      </a>
      <Navbar />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
