/**
 * Sincroniza as publicações do perfil oficial no Instagram.
 *
 * Gera dois arquivos, a partir da MESMA leitura:
 *   public/data/instagram.json  -> todas as publicações do período (página /campanha)
 *   public/data/destaques.json  -> as mais recentes, agrupadas por semana (/destaques)
 * e baixa a capa de cada post para public/img/instagram/<code>.jpg, porque as
 * URLs do CDN do Instagram expiram em poucos dias — hotlink quebraria o site.
 *
 * Duas fontes, nessa ordem:
 *   1. IG_ACCESS_TOKEN (Graph API oficial) — se o secret existir, é o caminho preferido;
 *   2. endpoint público do perfil — não precisa de token nem de login, é o que
 *      o próprio site do Instagram usa para montar a grade pública.
 *
 * Variáveis:
 *   IG_USUARIO  perfil (padrão: helenaduailibe)
 *   IG_DESDE    só publicações a partir dessa data (padrão: 2026-08-01, início da campanha)
 *   IG_LIMITE   teto de publicações (padrão: 60)
 *   IG_ACCESS_TOKEN  token da Graph API (opcional)
 *
 * Em caso de falha o script sai com erro SEM sobrescrever os JSONs — o site
 * continua exibindo a última sincronização boa.
 */
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const USUARIO = process.env.IG_USUARIO ?? 'helenaduailibe'
const DESDE = Date.parse(`${process.env.IG_DESDE ?? '2026-08-01'}T00:00:00Z`) / 1000
const LIMITE = Number(process.env.IG_LIMITE ?? 60)
const TOKEN = process.env.IG_ACCESS_TOKEN

const raiz = resolve(import.meta.dirname, '..')
const destinoPosts = resolve(raiz, 'public/data/instagram.json')
const destinoDestaques = resolve(raiz, 'public/data/destaques.json')
const destinoImg = resolve(raiz, 'public/img/instagram')

const CABECALHOS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'X-IG-App-ID': '936619743392459',
  Accept: '*/*',
  'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
  Referer: `https://www.instagram.com/${USUARIO}/`,
  'Sec-Fetch-Site': 'same-origin',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Dest': 'empty',
}

const dormir = (ms) => new Promise((r) => setTimeout(r, ms))

/** GET com backoff — o Instagram responde 401/429 quando acha que é robô. */
async function buscar(url, tentativas = 5) {
  let espera = 4000
  for (let i = 1; i <= tentativas; i++) {
    const r = await fetch(url, { headers: CABECALHOS })
    if (r.ok) return r.json()
    const corpo = await r.text()
    if (i === tentativas) throw new Error(`${r.status} em ${url} :: ${corpo.slice(0, 200)}`)
    console.warn(`  tentativa ${i} falhou (${r.status}), aguardando ${espera / 1000}s…`)
    await dormir(espera)
    espera *= 2
  }
}

// --- texto ------------------------------------------------------------------

function linhasDaLegenda(legenda = '') {
  return legenda
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/#[\wÀ-ÿ]+/g, '').replace(/@[\w.]+/g, '').trim())
    .filter(Boolean)
}

function cortar(texto, max) {
  if (texto.length <= max) return texto
  const fatia = texto.slice(0, max)
  return `${fatia.slice(0, fatia.lastIndexOf(' '))}…`
}

function montarTitulo(linhas) {
  const primeira = linhas[0] ?? ''
  const escolhida = primeira.length > 3 ? primeira : (linhas[1] ?? primeira)
  return cortar(escolhida, 90)
}

function montarSlug(data, titulo) {
  const limpo = titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60)
    .replace(/-+$/, '')
  return `${data}-${limpo || 'publicacao'}`
}

function semanaISO(ms) {
  const d = new Date(ms)
  const alvo = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  const dia = alvo.getUTCDay() || 7
  alvo.setUTCDate(alvo.getUTCDate() + 4 - dia)
  const inicioAno = new Date(Date.UTC(alvo.getUTCFullYear(), 0, 1))
  const semana = Math.ceil(((alvo - inicioAno) / 86400000 + 1) / 7)
  return `${alvo.getUTCFullYear()}-W${String(semana).padStart(2, '0')}`
}

// --- imagens ----------------------------------------------------------------

async function baixarCapa(url, nome) {
  if (!url) return ''
  if (!existsSync(destinoImg)) mkdirSync(destinoImg, { recursive: true })
  const caminho = resolve(destinoImg, `${nome}.jpg`)
  if (existsSync(caminho)) return `/img/instagram/${nome}.jpg` // já baixada: não repete
  const r = await fetch(url, { headers: { 'User-Agent': CABECALHOS['User-Agent'] } })
  if (!r.ok) throw new Error(`falha ao baixar capa ${nome}: ${r.status}`)
  writeFileSync(caminho, Buffer.from(await r.arrayBuffer()))
  return `/img/instagram/${nome}.jpg`
}

// --- fontes -----------------------------------------------------------------

/** Endpoint público: mesma chamada que a grade do perfil faz no navegador. */
async function lerPerfilPublico() {
  const perfil = await buscar(
    `https://www.instagram.com/api/v1/users/web_profile_info/?username=${USUARIO}`
  )
  const usuario = perfil?.data?.user
  if (!usuario?.id) throw new Error('perfil público não retornou id do usuário')

  const brutos = []
  let maxId = null
  for (let pagina = 1; pagina <= 10; pagina++) {
    const url = new URL(`https://www.instagram.com/api/v1/feed/user/${usuario.id}/`)
    url.searchParams.set('count', '33')
    if (maxId) url.searchParams.set('max_id', maxId)

    const dados = await buscar(url)
    const itens = dados.items ?? []
    brutos.push(...itens)
    const ultimo = itens.at(-1)
    console.log(
      `  página ${pagina}: ${itens.length} publicações (até ${new Date((ultimo?.taken_at ?? 0) * 1000).toISOString().slice(0, 10)})`
    )

    if (!dados.more_available || !dados.next_max_id) break
    if (brutos.length >= LIMITE * 2) break
    if (ultimo && ultimo.taken_at < DESDE) break
    maxId = dados.next_max_id
    await dormir(2500)
  }

  return brutos.map((item) => {
    const midia = item.carousel_media?.[0] ?? item
    const candidatas = midia.image_versions2?.candidates ?? []
    const capa = candidatas[0]?.url ?? ''
    const tipo =
      item.media_type === 8 ? 'CARROSSEL'
      : item.media_type === 2 ? (item.product_type === 'clips' ? 'REEL' : 'VIDEO')
      : 'IMAGE'
    return {
      id: String(item.pk ?? item.id),
      code: item.code,
      legenda: item.caption?.text ?? '',
      segundos: item.taken_at,
      capa,
      largura: candidatas[0]?.width ?? 1080,
      altura: candidatas[0]?.height ?? 1350,
      tipo,
      curtidas: item.like_count ?? null,
      comentarios: item.comment_count ?? null,
    }
  })
}

/** Graph API oficial — usada só quando existe token configurado. */
async function lerGraphApi() {
  const campos = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,shortcode'
  const dados = await buscar(
    `https://graph.instagram.com/me/media?fields=${campos}&limit=${LIMITE}&access_token=${TOKEN}`
  )
  return (dados.data ?? []).map((m) => ({
    id: m.id,
    code: m.shortcode ?? (m.permalink ?? '').split('/').filter(Boolean).at(-1),
    legenda: m.caption ?? '',
    segundos: Math.floor(Date.parse(m.timestamp) / 1000),
    capa: m.thumbnail_url || m.media_url,
    largura: 1080,
    altura: 1350,
    tipo: m.media_type === 'CAROUSEL_ALBUM' ? 'CARROSSEL' : m.media_type,
    curtidas: null,
    comentarios: null,
  }))
}

async function renovarToken() {
  if (!TOKEN) return
  try {
    const d = await (
      await fetch(
        `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${TOKEN}`
      )
    ).json()
    if (d.expires_in) console.log(`Token renovado. Expira em ~${Math.round(d.expires_in / 86400)} dias.`)
  } catch (erro) {
    console.warn('Não foi possível renovar o token:', erro.message)
  }
}

// --- principal --------------------------------------------------------------

async function principal() {
  console.log(`Lendo @${USUARIO} (${TOKEN ? 'Graph API' : 'perfil público'})…`)
  const brutos = TOKEN ? await lerGraphApi() : await lerPerfilPublico()

  const recortados = brutos
    .filter((b) => b.code && b.segundos >= DESDE)
    .sort((a, b) => b.segundos - a.segundos)
    .slice(0, LIMITE)

  if (recortados.length === 0) {
    throw new Error('nenhuma publicação no período — nada foi gravado')
  }

  const itens = []
  for (const bruto of recortados) {
    const linhas = linhasDaLegenda(bruto.legenda)
    const titulo = montarTitulo(linhas) || 'Publicação no Instagram'
    const data = new Date(bruto.segundos * 1000).toISOString().slice(0, 10)
    const imagem = await baixarCapa(bruto.capa, bruto.code)

    itens.push({
      id: bruto.id,
      code: bruto.code,
      slug: montarSlug(data, titulo),
      titulo,
      resumo: cortar(linhas.join(' ').replace(titulo, '').trim() || titulo, 180),
      data,
      semana: semanaISO(bruto.segundos * 1000),
      imagem,
      // é ISSO que liga cada peça à publicação original
      permalink: `https://www.instagram.com/p/${bruto.code}/`,
      tipo: bruto.tipo,
      largura: bruto.largura,
      altura: bruto.altura,
    })
    await dormir(300)
  }

  const atualizadoEm = new Date().toISOString()
  writeFileSync(destinoPosts, `${JSON.stringify({ atualizadoEm, itens }, null, 2)}\n`)
  console.log(`instagram.json: ${itens.length} publicações.`)

  // /destaques continua sendo o recorte editorial das últimas semanas
  const destaques = itens.slice(0, 12)
  writeFileSync(
    destinoDestaques,
    `${JSON.stringify({ atualizadoEm, itens: destaques }, null, 2)}\n`
  )
  console.log(`destaques.json: ${destaques.length} publicações.`)

  await renovarToken()
}

principal().catch((erro) => {
  console.error('\nSincronização falhou:', erro.message)
  const anterior = existsSync(destinoPosts)
    ? JSON.parse(readFileSync(destinoPosts, 'utf8')).itens?.length
    : 0
  console.error(`Nada foi sobrescrito — o site segue com as ${anterior} publicações anteriores.`)
  process.exit(1)
})
