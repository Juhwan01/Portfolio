import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PublicLayout from '@/layouts/PublicLayout'
import Home from '@pages/Home'
import AboutPage from '@pages/AboutPage'
import ProjectsPage from '@pages/ProjectsPage'
import ProjectDetail from '@pages/ProjectDetail'
import SkillsPage from '@pages/SkillsPage'
import BlogPage from '@pages/BlogPage'
import BlogPost from '@pages/BlogPost'
import ContactPage from '@pages/ContactPage'
import NotFound from '@pages/NotFound'

// Admin pages
import Login from '@pages/admin/Login'
import AdminLayout from '@pages/admin/AdminLayout'
import Dashboard from '@pages/admin/Dashboard'
import ProjectsAdmin from '@pages/admin/ProjectsAdmin'
import SkillsAdmin from '@pages/admin/SkillsAdmin'
import BlogAdmin from '@pages/admin/BlogAdmin'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes with shared layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          <Route path="skills" element={<SkillsAdmin />} />
          <Route path="blog" element={<BlogAdmin />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
