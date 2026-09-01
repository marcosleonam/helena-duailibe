/**
 * Painel da assessoria — helenaduailibe.com.br/admin
 *
 * Serviço mínimo (só biblioteca padrão do Node) que deixa a assessoria publicar
 * sozinha, sem mexer em código nem no GitHub:
 *   • clipping de imprensa (antes era o arquivo src/content/imprensa.js)
 *   • quais publicações do Instagram aparecem no site e quais ficam fixadas
 *   • botão para buscar o Instagram na hora, sem esperar o robô das 2h
 *
 * Escuta só em 127.0.0.1; quem expõe para a internet é o nginx, em /admin e
 * /api/, já sob o certificado do domínio.
 *
 * Escreve direto na pasta servida pelo nginx (<raizSite>/data), que está com
 * Cache-Control no-store — por isso toda alteração aparece no site na hora,
 * sem rebuild e sem deploy.
 *
 * Configuração em /etc/helena-painel/config.json (fora do repositório, porque
 * guarda o hash da senha e o segredo de sessão).
 */
import { createServer } from 'node:http'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, extname, normalize } from 'node:path'
import { spawn } from 'node:child_process'
import { scryptSync, createHmac, timingSafeEqual } from 'node:crypto'
import { aplicarEditorial, lerJson } from '../scripts/editorial.mjs'

const CONFIG = process.env.PAINEL_CONFIG ?? '/etc/helena-painel/config.json'
const cfg = JSON.parse(readFileSync(CONFIG, 'utf8'))

const PORTA = cfg.porta ?? 8790
const RAIZ_SITE = cfg.raizSite ?? '/var/www/helenaduailibe'
const PASTA_DADOS = resolve(RAIZ_SITE, 'data')
const PUBLICO = resolve(import.meta.dirname, 'publico')
const VALIDADE_SESSAO = 12 * 60 * 60 * 1000 // 12h

// --- senha e sessão ---------------------------------------------------------

export function derivar(senha, salt) {
  return scryptSync(senha, salt, 32).toString('hex')
}

/** Comparação em tempo constante — evita vazar a senha pelo tempo de resposta. */
function iguais(a, b) {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  return ba.length === bb.length && timingSafeEqual(ba, bb)
}

function conferirSenha(usuario, senha) {
  const registro = cfg.usuarios?.[usuario]
  if (!registro) return false
  return iguais(derivar(senha, registro.salt), registro.hash)
}

function assinarSessao(usuario) {
  const expira = Date.now() + VALIDADE_SESSAO
  const corpo = `${usuario}.${expira}`
  const assinatura = createHmac('sha256', cfg.segredo).update(corpo).digest('hex')
  return `${corpo}.${assinatura}`
}

function lerSessao(cookie = '') {
  const bruto = cookie.split(';').map((c) => c.trim()).find((c) => c.startsWith('painel='))
  if (!bruto) return null
  const valor = decodeURIComponent(bruto.slice('painel='.length))
  const [usuario, expira, assinatura] = valor.split('.')
  if (!usuario || !expira || !assinatura) return null
  const esperada = createHmac('sha256', cfg.segredo).update(`${usuario}.${expira}`).digest('hex')
  if (!iguais(assinatura, esperada)) return null
  if (Number(expira) < Date.now()) return null
  return usuario
}

// Freio de força bruta: 5 erros por IP a cada 15 min.
const tentativas = new Map()
function podeTentar(ip) {
  const agora = Date.now()
  const registro = tentativas.get(ip)
  if (!registro || agora - registro.desde > 15 * 60 * 1000) {
    tentativas.set(ip, { desde: agora, erros: 0 })
    return true
  }
  return registro.erros < 5
}
function marcarErro(ip) {
  const registro = tentativas.get(ip) ?? { desde: Date.now(), erros: 0 }
  registro.erros += 1
  tentativas.set(ip, registro)
}

// --- utilidades HTTP --------------------------------------------------------

const responder = (res, codigo, dados, cabecalhos = {}) => {
  const corpo = JSON.stringify(dados)
  res.writeHead(codigo, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...cabecalhos,
  })
  res.end(corpo)
}

async function lerCorpo(req, limite = 1_000_000) {
  const partes = []
  let total = 0
  for await (const parte of req) {
    total += parte.length
    if (total > limite) throw new Error('corpo grande demais')
    partes.push(parte)
  }
  if (!total) return {}
  return JSON.parse(Buffer.concat(partes).toString('utf8'))
}

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
}

function servirEstatico(res, arquivo) {
  // normalize + prefixo travam qualquer ../ vindo da URL
  const caminho = resolve(PUBLICO, normalize(arquivo).replace(/^(\.\.[/\\])+/, ''))
  if (!caminho.startsWith(PUBLICO) || !existsSync(caminho)) {
    res.writeHead(404).end('não encontrado')
    return
  }
  res.writeHead(200, {
    'Content-Type': TIPOS[extname(caminho)] ?? 'application/octet-stream',
    'Cache-Control': 'no-store',
  })
  res.end(readFileSync(caminho))
}

// --- dados ------------------------------------------------------------------

const arquivo = (nome) => resolve(PASTA_DADOS, nome)

function gravar(nome, dados) {
  writeFileSync(arquivo(nome), `${JSON.stringify(dados, null, 2)}\n`)
}

/** Aceita só os campos que o site usa — nada do navegador entra cru no JSON. */
function limparImprensa(lista) {
  if (!Array.isArray(lista)) throw new Error('lista inválida')
  return lista.slice(0, 200).map((item) => {
    const url = String(item.url ?? '').trim()
    if (!/^https?:\/\//i.test(url)) throw new Error(`link inválido: ${url || '(vazio)'}`)
    const titulo = String(item.titulo ?? '').trim()
    if (!titulo) throw new Error('matéria sem título')
    return {
      titulo: titulo.slice(0, 300),
      veiculo: String(item.veiculo ?? '').trim().slice(0, 120),
      data: String(item.data ?? '').trim().slice(0, 60),
      url,
    }
  })
}

function limparEditorial(dados, codigosValidos) {
  const filtrar = (lista) =>
    [...new Set((Array.isArray(lista) ? lista : []).map(String))]
      .filter((code) => codigosValidos.has(code))
      .slice(0, 200)
  return { ocultos: filtrar(dados.ocultos), fixados: filtrar(dados.fixados) }
}

/** Dispara o robô de sincronização. Um por vez. */
let sincronizando = false
function sincronizar() {
  if (sincronizando) return Promise.resolve({ ok: false, mensagem: 'Já tem uma sincronização em andamento.' })
  sincronizando = true
  return new Promise((resolver) => {
    const script = resolve(import.meta.dirname, '../scripts/sync-instagram.mjs')
    const filho = spawn(process.execPath, [script], {
      env: { ...process.env, IG_SAIDA: RAIZ_SITE },
      cwd: resolve(import.meta.dirname, '..'),
    })
    let saida = ''
    filho.stdout.on('data', (d) => { saida += d })
    filho.stderr.on('data', (d) => { saida += d })
    filho.on('close', (codigo) => {
      sincronizando = false
      resolver({
        ok: codigo === 0,
        mensagem: codigo === 0
          ? 'Instagram sincronizado.'
          : 'A leitura do Instagram falhou — o site seguiu com as publicações anteriores.',
        log: saida.trim().split('\n').slice(-6).join('\n'),
      })
    })
  })
}

// --- rotas ------------------------------------------------------------------

const servidor = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://painel')
  const rota = url.pathname.replace(/\/+$/, '') || '/'
  const ip = req.headers['x-real-ip'] ?? req.socket.remoteAddress ?? 'desconhecido'

  try {
    // --- login (única rota pública além dos estáticos) ---
    if (rota === '/api/entrar' && req.method === 'POST') {
      if (!podeTentar(ip)) {
        return responder(res, 429, { erro: 'Muitas tentativas. Espere 15 minutos.' })
      }
      const { usuario, senha } = await lerCorpo(req)
      if (!usuario || !senha || !conferirSenha(String(usuario), String(senha))) {
        marcarErro(ip)
        return responder(res, 401, { erro: 'Usuário ou senha incorretos.' })
      }
      tentativas.delete(ip)
      const cookie = `painel=${encodeURIComponent(assinarSessao(String(usuario)))}` +
        `; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${VALIDADE_SESSAO / 1000}`
      return responder(res, 200, { usuario }, { 'Set-Cookie': cookie })
    }

    if (rota === '/api/sair' && req.method === 'POST') {
      return responder(res, 200, { ok: true }, {
        'Set-Cookie': 'painel=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0',
      })
    }

    // --- daqui para baixo, tudo exige sessão ---
    if (rota.startsWith('/api/')) {
      const usuario = lerSessao(req.headers.cookie)
      if (!usuario) return responder(res, 401, { erro: 'Sessão expirada. Entre de novo.' })

      if (rota === '/api/sessao') return responder(res, 200, { usuario })

      if (rota === '/api/imprensa') {
        if (req.method === 'GET') {
          return responder(res, 200, { itens: lerJson(arquivo('imprensa.json'), { itens: [] }).itens ?? [] })
        }
        if (req.method === 'PUT') {
          const corpo = await lerCorpo(req)
          const itens = limparImprensa(corpo.itens)
          gravar('imprensa.json', { atualizadoEm: new Date().toISOString(), itens })
          return responder(res, 200, { itens, mensagem: `${itens.length} matérias publicadas.` })
        }
      }

      if (rota === '/api/publicacoes' && req.method === 'GET') {
        const bruto = lerJson(arquivo('publicacoes.json'), { itens: [], atualizadoEm: null })
        const editorial = lerJson(arquivo('editorial.json'), { ocultos: [], fixados: [] })
        return responder(res, 200, {
          atualizadoEm: bruto.atualizadoEm,
          itens: bruto.itens ?? [],
          ocultos: editorial.ocultos ?? [],
          fixados: editorial.fixados ?? [],
        })
      }

      if (rota === '/api/editorial' && req.method === 'PUT') {
        const corpo = await lerCorpo(req)
        const bruto = lerJson(arquivo('publicacoes.json'), { itens: [] })
        const codigos = new Set((bruto.itens ?? []).map((i) => i.code))
        const editorial = limparEditorial(corpo, codigos)
        gravar('editorial.json', editorial)
        const recorte = aplicarEditorial(RAIZ_SITE)
        return responder(res, 200, {
          ...editorial,
          mensagem: `${recorte.publicadas} publicações no site, ${recorte.destaques} em destaque.`,
        })
      }

      if (rota === '/api/sincronizar' && req.method === 'POST') {
        return responder(res, 200, await sincronizar())
      }

      return responder(res, 404, { erro: 'rota desconhecida' })
    }

    // --- painel (HTML/CSS/JS) ---
    if (rota === '/admin' || rota === '/') return servirEstatico(res, 'index.html')
    if (rota.startsWith('/admin/')) return servirEstatico(res, rota.slice('/admin/'.length))

    res.writeHead(404).end('não encontrado')
  } catch (erro) {
    responder(res, 400, { erro: erro.message })
  }
})

servidor.listen(PORTA, '127.0.0.1', () => {
  console.log(`Painel da assessoria em http://127.0.0.1:${PORTA} (site: ${RAIZ_SITE})`)
})
