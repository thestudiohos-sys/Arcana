import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { buildCardPages } from './src/content/cardPages'

/**
 * Serves the static card-meaning pages (/cards/, /ko/cards/) in dev and
 * writes them into dist/ at build time. Set VITE_SITE_URL to the public
 * site address to also add canonical/hreflang tags, sitemap.xml and robots.txt.
 */
function cardPagesPlugin(siteUrl?: string): Plugin {
  const { pages, extraFiles } = buildCardPages({ siteUrl })
  const byUrl = new Map(pages.map((page) => [page.urlPath, page]))

  return {
    name: 'arcana-card-pages',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = (req.url ?? '').split(/[?#]/)[0]
        const page = byUrl.get(path) ?? byUrl.get(`${path}/`)
        if (!page) return next()
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(page.html)
      })
    },
    generateBundle() {
      for (const page of pages) {
        this.emitFile({ type: 'asset', fileName: page.fileName, source: page.html })
      }
      for (const file of extraFiles) {
        this.emitFile({ type: 'asset', fileName: file.fileName, source: file.source })
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), cardPagesPlugin(env.VITE_SITE_URL)],
  }
})
