/**
 * Pós-build:
 *  1. copia dist/index.html para dist/404.html — o GitHub Pages devolve o 404
 *     em rotas desconhecidas, e como ele é o mesmo shell do SPA, /destaques/xxx
 *     funciona com refresh direto;
 *  2. gera o sitemap.xml com as rotas fixas + os destaques do JSON.
 */
import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

const raiz = resolve(import.meta.dirname, '..')
const dist = resolve(raiz, 'dist')
const SITE = 'https://marcosleonam.github.io/helena-duailibe'

copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))

const rotas = ['/', '/biografia', '/atuacao', '/destaques', '/contato']

const arquivoDestaques = resolve(dist, 'data/destaques.json')
if (existsSync(arquivoDestaques)) {
  const dados = JSON.parse(readFileSync(arquivoDestaques, 'utf8'))
  for (const item of dados.itens ?? []) {
    if (item.slug) rotas.push(`/destaques/${item.slug}`)
  }
}

const hoje = new Date().toISOString().slice(0, 10)
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rotas.map((r) => `  <url>\n    <loc>${SITE}${r}</loc>\n    <lastmod>${hoje}</lastmod>\n  </url>`).join('\n')}
</urlset>
`
writeFileSync(resolve(dist, 'sitemap.xml'), xml)

console.log(`pos-build: 404.html criado e sitemap.xml com ${rotas.length} rotas`)
