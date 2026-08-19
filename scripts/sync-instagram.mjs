/**
 * Sincroniza os destaques do Instagram e grava public/data/destaques.json.
 *
 * Roda dentro da GitHub Action (.github/workflows/sync-instagram.yml).
 * O token vive em Settings → Secrets → Actions como IG_ACCESS_TOKEN e nunca
 * entra no código publicado — o site lê apenas o JSON estático.
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const TOKEN = process.env.IG_ACCESS_TOKEN
const LIMITE = Number(process.env.IG_LIMITE ?? 24)
const raiz = resolve(import.meta.dirname, '..')
const destinoJson = resolve(raiz, 'public/data/destaques.json')
const destinoImg = resolve(raiz, 'public/img/destaques')

if (!TOKEN) {
  console.error('IG_ACCESS_TOKEN ausente. Configure o secret no repositório.')
  process.exit(1)
}

const CAMPOS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp'

function semanaISO(iso) {
  const d = new Date(iso)
  const alvo = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  const dia = alvo.getUTCDay() || 7
  alvo.setUTCDate(alvo.getUTCDate() + 4 - dia)
  const inicioAno = new Date(Date.UTC(alvo.getUTCFullYear(), 0, 1))
  const semana = Math.ceil(((alvo - inicioAno) / 86400000 + 1) / 7)
  return `${alvo.getUTCFullYear()}-W${String(semana).padStart(2, '0')}`
}

function limparLegenda(legenda = '') {
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

async function baixarImagem(url, id) {
  if (!url) return ''
  const resposta = await fetch(url)
  if (!resposta.ok) throw new Error(`falha ao baixar imagem ${id}: ${resposta.status}`)
  const bytes = Buffer.from(await resposta.arrayBuffer())
  if (!existsSync(destinoImg)) mkdirSync(destinoImg, { recursive: true })
  writeFileSync(resolve(destinoImg, `${id}.jpg`), bytes)
  return `/img/destaques/${id}.jpg`
}

async function renovarToken() {
  const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${TOKEN}`
  try {
    const r = await fetch(url)
    const dados = await r.json()
    if (dados.expires_in) {
      console.log(`Token renovado. Expira em ~${Math.round(dados.expires_in / 86400)} dias.`)
    }
  } catch (erro) {
    console.warn('Não foi possível renovar o token:', erro.message)
  }
}

async function principal() {
  const url = `https://graph.instagram.com/me/media?fields=${CAMPOS}&limit=${LIMITE}&access_token=${TOKEN}`
  const resposta = await fetch(url)
  if (!resposta.ok) {
    throw new Error(`Graph API respondeu ${resposta.status}: ${await resposta.text()}`)
  }
  const { data = [] } = await resposta.json()

  const itens = []
  for (const midia of data) {
    if (midia.media_type === 'VIDEO' && !midia.thumbnail_url) continue
    const linhas = limparLegenda(midia.caption)
    const titulo = montarTitulo(linhas)
    if (!titulo) continue

    const dataPub = midia.timestamp.slice(0, 10)
    const imagem = await baixarImagem(midia.thumbnail_url || midia.media_url, midia.id)

    itens.push({
      id: midia.id,
      slug: montarSlug(dataPub, titulo),
      titulo,
      resumo: cortar(linhas.join(' ').replace(titulo, '').trim() || titulo, 180),
      data: dataPub,
      semana: semanaISO(midia.timestamp),
      imagem,
      permalink: midia.permalink,
      tipo: midia.media_type,
    })
  }

  writeFileSync(
    destinoJson,
    `${JSON.stringify({ atualizadoEm: new Date().toISOString(), itens }, null, 2)}\n`
  )
  console.log(`destaques.json atualizado com ${itens.length} itens.`)

  await renovarToken()
}

principal().catch((erro) => {
  console.error(erro)
  process.exit(1)
})
