import { http, HttpResponse } from 'msw'
import {
  mockProjects,
  mockProject,
  mockBlogPosts,
  mockBlogPost,
  mockSkills,
  mockExperiences,
  mockResearch,
} from './data'

const BASE_URL = 'http://localhost:8000'

export const handlers = [
  // Auth
  http.post(`${BASE_URL}/api/auth/login`, () => {
    return HttpResponse.json({
      access_token: 'mock-jwt-token',
      token_type: 'bearer',
    })
  }),

  http.post(`${BASE_URL}/api/auth/register`, () => {
    return HttpResponse.json({
      access_token: 'mock-jwt-token',
      token_type: 'bearer',
    })
  }),

  // Projects
  http.get(`${BASE_URL}/api/projects`, () => {
    return HttpResponse.json(mockProjects)
  }),

  http.get(`${BASE_URL}/api/projects/:id`, () => {
    return HttpResponse.json(mockProject)
  }),

  http.post(`${BASE_URL}/api/projects`, () => {
    return HttpResponse.json(mockProject)
  }),

  http.put(`${BASE_URL}/api/projects/:id`, () => {
    return HttpResponse.json(mockProject)
  }),

  http.delete(`${BASE_URL}/api/projects/:id`, () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // Skills
  http.get(`${BASE_URL}/api/skills`, () => {
    return HttpResponse.json(mockSkills)
  }),

  http.post(`${BASE_URL}/api/skills`, () => {
    return HttpResponse.json(mockSkills[0])
  }),

  http.post(`${BASE_URL}/api/skills/bulk`, () => {
    return HttpResponse.json(mockSkills)
  }),

  http.put(`${BASE_URL}/api/skills/:id`, () => {
    return HttpResponse.json(mockSkills[0])
  }),

  http.delete(`${BASE_URL}/api/skills/:id`, () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // Blog
  http.get(`${BASE_URL}/api/blog`, () => {
    return HttpResponse.json(mockBlogPosts)
  }),

  http.get(`${BASE_URL}/api/blog/:id`, () => {
    return HttpResponse.json(mockBlogPost)
  }),

  http.post(`${BASE_URL}/api/blog`, () => {
    return HttpResponse.json(mockBlogPost)
  }),

  http.put(`${BASE_URL}/api/blog/:id`, () => {
    return HttpResponse.json(mockBlogPost)
  }),

  http.delete(`${BASE_URL}/api/blog/:id`, () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // Experience
  http.get(`${BASE_URL}/api/experience`, () => {
    return HttpResponse.json(mockExperiences)
  }),

  // Research
  http.get(`${BASE_URL}/api/research`, () => {
    return HttpResponse.json(mockResearch)
  }),

  // Contact
  http.post(`${BASE_URL}/api/contact`, () => {
    return HttpResponse.json({ message: 'Success' })
  }),

  // Upload
  http.post(`${BASE_URL}/api/upload/image`, () => {
    return HttpResponse.json({
      url: 'https://example.com/uploaded.png',
      filename: 'uploaded.png',
    })
  }),
]
