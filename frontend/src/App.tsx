import { BrowserRouter as Router, Navigate, Route, Routes, useParams } from 'react-router-dom'
import HomePage from '@/site/HomePage'
import PostPage, { BlogPage } from '@/site/PostPage'
import ProjectPage from '@/site/ProjectPage'
import SiteLayout, { NotFoundPage } from '@/site/SiteLayout'

/** The previous site also served projects at /project/:id. */
function LegacyProjectRedirect() {
  const { id = '' } = useParams()
  return <Navigate to={`/projects/${id}`} replace />
}

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route path="/project/:id" element={<LegacyProjectRedirect />} />
          <Route path="/projects" element={<Navigate to="/#projects" replace />} />
          <Route path="/about" element={<Navigate to="/#about" replace />} />
          <Route path="/skills" element={<Navigate to="/#skills" replace />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<PostPage />} />
          <Route path="/contact" element={<Navigate to="/#contact" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
