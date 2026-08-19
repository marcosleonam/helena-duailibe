/**
 * Pós-build:
 *  1. copia dist/index.html para dist/404.html — rede de segurança do SPA;
 *  2. cria uma cópia do index em cada rota (/biografia/index.html, e uma por
 *     destaque) para que o refresh direto responda 200, e não 404 servido pelo
 *     fallback do GitHub Pages — o que estragaria SEO e sitemap;
 *  3. gera sitemap.xml com as rotas fixas + os destaques do JSON;
 *  4. escreve um .htaccess para quando o site migrar para hospedagem própria.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'

const raiz = resolve(import.meta.dirname, '..')
const dist = resolve(raiz, 'dist')
const SITE = 'https://marcosleonam.github.io/helena-duailibe'

const indexHtml = resolve(dist, 'index.html')
copyFileSync(indexHtml, resolve(dist, '404.html'))

const rotas = ['/biografia', '/atuacao', '/destaques', '/imprensa', '/contato']

const arquivoDestaques = resolve(dist, 'data/destaques.json')
if (existsSync(arquivoDestaques)) {
  const dados = JSON.parse(readFileSync(arquivoDestaques, 'utf8'))
  for (const item of dados.itens ?? []) {
    if (item.slug) rotas.push(`/destaques/${item.slug}`)
  }
}

for (const rota of rotas) {
  const destino = resolve(dist, `.${rota}/index.html`)
  mkdirSync(dirname(destino), { recursive: true })
  copyFileSync(indexHtml, destino)
}

const hoje = new Date().toISOString().slice(0, 10)
const todas = ['/', ...rotas]
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${todas.map((r) => `  <url>\n    <loc>${SITE}${r}</loc>\n    <lastmod>${hoje}</lastmod>\n  </url>`).join('\n')}
</urlset>
`
writeFileSync(resolve(dist, 'sitemap.xml'), xml)

// Hospedagem Apache (padrão nas hospedagens brasileiras): manda tudo para o SPA.
writeFileSync(
  resolve(dist, '.htaccess'),
  `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
`
)

console.log(`pos-build: ${rotas.length} rotas pre-renderizadas, sitemap com ${todas.length} URLs, 404.html e .htaccess`)
