import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '@pages/Home'
import ProjectDetail from '@pages/ProjectDetail'
import BlogPost from '@pages/BlogPost'
import NotFound from '@pages/NotFound'

// Admin pages
import Login from '@pages/admin/Login'
import AdminLayout from '@pages/admin/AdminLayout'
import Dashboard from '@pages/admin/Dashboard'
import ProjectsAdmin from '@pages/admin/ProjectsAdmin'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/blog/:id" element={<BlogPost />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<ProjectsAdmin />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
