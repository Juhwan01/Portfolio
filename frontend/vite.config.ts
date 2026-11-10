import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import yaml from 'js-yaml'

const CONTENT_DIR = path.resolve(__dirname, 'content')
const FRONTMATTER = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/

/** Read every `*.md` in a content folder as frontmatter fields + `body`. */
function readMarkdownDir(dir: string, idKey: string) {
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .sort()
    .map((name) => {
      const text = fs.readFileSync(path.join(dir, name), 'utf8')
      const match = FRONTMATTER.exec(text)
      if (!match) throw new Error(`content: ${name} has no frontmatter`)
      const meta = yaml.load(match[1]) as Record<string, unknown>
      return { [idKey]: name.replace(/\.md$/, ''), ...meta, body: match[2].replace(/^\n/, '') }
    })
}

/**
 * Serves frontend/content/ as the module `virtual:content`, parsed at build time so the
 * browser never ships a YAML parser. Editing a content file reloads the dev page.
 */
function contentPlugin(): Plugin {
  const publicId = 'virtual:content'
  const resolvedId = '\0' + publicId
  return {
    name: 'portfolio-content',
    resolveId: (id) => (id === publicId ? resolvedId : undefined),
    load(id) {
      if (id !== resolvedId) return
      const profile = yaml.load(fs.readFileSync(path.join(CONTENT_DIR, 'profile.yaml'), 'utf8'))
      const projects = readMarkdownDir(path.join(CONTENT_DIR, 'projects'), 'slug')
      const posts = readMarkdownDir(path.join(CONTENT_DIR, 'blog'), 'id')
      const redirects = yaml.load(fs.readFileSync(path.join(CONTENT_DIR, 'redirects.yaml'), 'utf8'))
      return [
        `export const profile = ${JSON.stringify(profile)};`,
        `export const projects = ${JSON.stringify(projects)};`,
        `export const posts = ${JSON.stringify(posts)};`,
        `export const redirects = ${JSON.stringify(redirects)};`,
      ].join('\n')
    },
    handleHotUpdate({ file, server }) {
      if (!file.startsWith(CONTENT_DIR)) return
      const mod = server.moduleGraph.getModuleById(resolvedId)
      if (mod) server.moduleGraph.invalidateModule(mod)
      server.ws.send({ type: 'full-reload' })
      return []
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), contentPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@services': path.resolve(__dirname, './src/services'),
            '@contexts': path.resolve(__dirname, './src/contexts'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@stores': path.resolve(__dirname, './src/stores'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
})
