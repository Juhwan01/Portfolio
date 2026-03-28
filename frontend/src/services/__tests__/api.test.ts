import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'
import { http, HttpResponse } from 'msw'

vi.mock('@utils/constants', () => ({
  API_BASE_URL: 'http://localhost:8000',
}))

// Import after mock so the module picks up the mocked constant
const { server } = await import('@/test/mocks/server')
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  getBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getExperiences,
  getResearch,
  submitContactForm,
  uploadImage,
  login,
  register,
} = await import('../api')
const { mockContactForm } = await import('@/test/mocks/data')

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  localStorage.clear()
})
afterAll(() => server.close())

describe('API Service', () => {
  describe('getProjects', () => {
    it('fetches and returns projects with camelCase keys', async () => {
      const projects = await getProjects()
      expect(Array.isArray(projects)).toBe(true)
      expect(projects.length).toBeGreaterThan(0)
      expect(projects[0]).toHaveProperty('id')
      expect(projects[0]).toHaveProperty('title')
    })

    it('supports query params (featured, category, status)', async () => {
      let capturedUrl = ''
      server.use(
        http.get('http://localhost:8000/api/projects', ({ request }) => {
          capturedUrl = request.url
          return HttpResponse.json([])
        })
      )

      await getProjects({ featured: true, category: 'AI' })
      expect(capturedUrl).toContain('featured=true')
      expect(capturedUrl).toContain('category=AI')
    })
  })

  describe('getProjectById', () => {
    it('fetches a single project by ID', async () => {
      const project = await getProjectById('test-project-1')
      expect(project).toHaveProperty('id')
      expect(project).toHaveProperty('title')
    })
  })

  describe('createProject', () => {
    it('sends POST request and returns created project', async () => {
      const result = await createProject({
        title: 'New Project',
        description: 'Desc',
        tech_stack: ['React'],
      })
      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('title')
    })
  })

  describe('updateProject', () => {
    it('sends PUT request and returns updated project', async () => {
      const result = await updateProject('test-project-1', {
        title: 'Updated',
      })
      expect(result).toHaveProperty('id')
    })
  })

  describe('deleteProject', () => {
    it('sends DELETE request without throwing', async () => {
      await expect(deleteProject('test-project-1')).resolves.toBeUndefined()
    })
  })

  describe('getSkills', () => {
    it('fetches and returns skills array', async () => {
      const skills = await getSkills()
      expect(Array.isArray(skills)).toBe(true)
      expect(skills.length).toBeGreaterThan(0)
      expect(skills[0]).toHaveProperty('name')
      expect(skills[0]).toHaveProperty('category')
    })

    it('supports category filter param', async () => {
      let capturedUrl = ''
      server.use(
        http.get('http://localhost:8000/api/skills', ({ request }) => {
          capturedUrl = request.url
          return HttpResponse.json([])
        })
      )

      await getSkills('Frontend')
      expect(capturedUrl).toContain('category=Frontend')
    })
  })

  describe('createSkill', () => {
    it('sends POST and returns created skill', async () => {
      const result = await createSkill({ name: 'Go', category: 'Backend' })
      expect(result).toHaveProperty('name')
    })
  })

  describe('updateSkill', () => {
    it('sends PUT and returns updated skill', async () => {
      const result = await updateSkill(1, { name: 'Go' })
      expect(result).toHaveProperty('name')
    })
  })

  describe('deleteSkill', () => {
    it('sends DELETE request without throwing', async () => {
      await expect(deleteSkill(1)).resolves.toBeUndefined()
    })
  })

  describe('getBlogPosts', () => {
    it('fetches and returns blog posts', async () => {
      const posts = await getBlogPosts()
      expect(Array.isArray(posts)).toBe(true)
      expect(posts.length).toBeGreaterThan(0)
      expect(posts[0]).toHaveProperty('title')
    })
  })

  describe('getBlogPostById', () => {
    it('fetches a single blog post by ID', async () => {
      const post = await getBlogPostById('test-blog-1')
      expect(post).toHaveProperty('id')
      expect(post).toHaveProperty('title')
    })
  })

  describe('createBlogPost', () => {
    it('sends POST and returns created post', async () => {
      const result = await createBlogPost({
        id: 'new-blog',
        title: 'New Post',
        excerpt: 'Summary',
        content: '# Hello',
        cover_image: '',
        tags: ['test'],
        category: 'tutorial',
        read_time: 3,
      })
      expect(result).toHaveProperty('title')
    })
  })

  describe('updateBlogPost', () => {
    it('sends PUT and returns updated post', async () => {
      const result = await updateBlogPost('test-blog-1', { title: 'Updated' })
      expect(result).toHaveProperty('title')
    })
  })

  describe('deleteBlogPost', () => {
    it('sends DELETE request', async () => {
      const result = await deleteBlogPost('test-blog-1')
      expect(result).toBeDefined()
    })
  })

  describe('getExperiences', () => {
    it('fetches and returns experiences', async () => {
      const experiences = await getExperiences()
      expect(Array.isArray(experiences)).toBe(true)
      expect(experiences[0]).toHaveProperty('company')
    })
  })

  describe('getResearch', () => {
    it('fetches and returns research items', async () => {
      const research = await getResearch()
      expect(Array.isArray(research)).toBe(true)
      expect(research[0]).toHaveProperty('title')
    })
  })

  describe('submitContactForm', () => {
    it('submits contact form data and returns response', async () => {
      const result = await submitContactForm(mockContactForm)
      expect(result).toHaveProperty('message')
    })
  })

  describe('uploadImage', () => {
    it('sends POST with multipart/form-data and returns response', async () => {
      // MSW + axios + FormData in jsdom has known issues with multipart requests.
      // Instead we verify the function signature and that it calls the correct endpoint.
      const apiDefault = await import('../api')
      const api = apiDefault.default

      const postSpy = vi.spyOn(api, 'post').mockResolvedValueOnce({
        data: { url: 'https://example.com/uploaded.png', filename: 'uploaded.png' },
      } as any)

      const file = new File(['dummy'], 'photo.png', { type: 'image/png' })
      const result = await uploadImage(file)

      expect(postSpy).toHaveBeenCalledWith(
        '/api/upload/image',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      )
      expect(result).toHaveProperty('url', 'https://example.com/uploaded.png')
      expect(result).toHaveProperty('filename', 'uploaded.png')

      postSpy.mockRestore()
    })
  })

  describe('login', () => {
    it('sends login request and returns transformed token response', async () => {
      const result = await login({ username: 'admin', password: 'password' })
      expect(result).toHaveProperty('accessToken', 'mock-jwt-token')
      expect(result).toHaveProperty('tokenType', 'bearer')
    })
  })

  describe('register', () => {
    it('sends register request and returns token response', async () => {
      const result = await register({ username: 'newuser', password: 'password' })
      expect(result).toHaveProperty('accessToken', 'mock-jwt-token')
    })
  })

  describe('snake_case to camelCase transformation', () => {
    it('transforms nested snake_case keys to camelCase', async () => {
      server.use(
        http.get('http://localhost:8000/api/projects', () => {
          return HttpResponse.json([
            {
              id: 'p1',
              title: 'Test',
              tech_stack: ['React'],
              thumbnail_url: 'http://example.com/img.png',
              demo_url: 'http://demo.com',
              github_url: 'http://github.com/test',
              start_date: '2024-01-01',
              end_date: '2024-06-01',
              team_composition: [{ role_name: 'Dev', member_count: 2 }],
            },
          ])
        })
      )

      const projects = await getProjects()
      const project = projects[0]
      expect(project).toHaveProperty('techStack')
      expect(project).toHaveProperty('thumbnailUrl')
      expect(project).toHaveProperty('demoUrl')
      expect(project).toHaveProperty('githubUrl')
      expect(project).toHaveProperty('startDate')
      expect(project).toHaveProperty('endDate')
      expect(project).toHaveProperty('teamComposition')
    })

    it('handles null and undefined values', async () => {
      server.use(
        http.get('http://localhost:8000/api/projects/:id', () => {
          return HttpResponse.json({
            id: 'p1',
            title: 'Test',
            demo_url: null,
            github_url: undefined,
          })
        })
      )

      const project = await getProjectById('p1')
      expect(project).toHaveProperty('demoUrl', null)
    })

    it('handles arrays of objects', async () => {
      server.use(
        http.get('http://localhost:8000/api/skills', () => {
          return HttpResponse.json([
            { id: 1, skill_name: 'React', created_at: '2024-01-01' },
            { id: 2, skill_name: 'Python', created_at: '2024-01-02' },
          ])
        })
      )

      const skills = await getSkills()
      expect(skills[0]).toHaveProperty('skillName')
      expect(skills[0]).toHaveProperty('createdAt')
    })
  })

  describe('Request interceptor - auth token', () => {
    it('attaches Authorization header when auth-storage exists in localStorage', async () => {
      let capturedAuthHeader: string | undefined

      server.use(
        http.get('http://localhost:8000/api/projects', ({ request }) => {
          capturedAuthHeader = request.headers.get('Authorization') ?? undefined
          return HttpResponse.json([])
        })
      )

      localStorage.setItem(
        'auth-storage',
        JSON.stringify({ state: { token: 'test-token' } })
      )

      await getProjects()
      expect(capturedAuthHeader).toBe('Bearer test-token')
    })

    it('does not attach Authorization header when no auth-storage exists', async () => {
      let capturedAuthHeader: string | null = null

      server.use(
        http.get('http://localhost:8000/api/projects', ({ request }) => {
          capturedAuthHeader = request.headers.get('Authorization')
          return HttpResponse.json([])
        })
      )

      await getProjects()
      expect(capturedAuthHeader).toBeNull()
    })
  })

  describe('Response interceptor - 401 handling', () => {
    it('clears localStorage and redirects on 401 response', async () => {
      localStorage.setItem('auth-storage', JSON.stringify({ state: { token: 'expired' } }))

      server.use(
        http.get('http://localhost:8000/api/projects', () => {
          return HttpResponse.json(null, { status: 401 })
        })
      )

      await expect(getProjects()).rejects.toThrow()
      expect(localStorage.getItem('auth-storage')).toBeNull()
      expect(window.location.href).toBe('/admin/login')
    })
  })
})
