/**
 * Painel da assessoria. Vanilla de propósito: sem build, sem dependência para
 * atualizar — é um arquivo que o servidor entrega direto.
 *
 * Regra de ouro da interface: nada é publicado sem clique explícito em
 * "Publicar no site". Editar em tela não muda o site.
 */

const $ = (s) => document.querySelector(s)
const criar = (tag, props = {}) => Object.assign(document.createElement(tag), props)

const MESES = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']
const dataPorExtenso = (iso) => {
  if (!iso) return ''
  const [a, m, d] = iso.split('-').map(Number)
  return `${d} de ${MESES[m - 1]} de ${a}`
}

async function api(rota, opcoes = {}) {
  const r = await fetch(`/api/${rota}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opcoes,
  })
  const dados = await r.json().catch(() => ({}))
  if (r.status === 401 && rota !== 'entrar') {
    mostrarEntrada()
    throw new Error(dados.erro ?? 'sessão expirada')
  }
  if (!r.ok) throw new Error(dados.erro ?? 'algo deu errado')
  return dados
}

/** Mensagem ao lado dos botões — some sozinha para não virar poluição. */
let apagador
function avisar(alvo, texto, tipo = 'ok') {
  const el = $(alvo)
  el.textContent = texto
  el.className = `estado estado--${tipo}`
  clearTimeout(apagador)
  if (tipo === 'ok') apagador = setTimeout(() => { el.textContent = '' }, 6000)
}

async function comBotaoOcupado(botao, rotulo, tarefa) {
  const original = botao.textContent
  botao.disabled = true
  botao.textContent = rotulo
  try {
    return await tarefa()
  } finally {
    botao.disabled = false
    botao.textContent = original
  }
}

// --- entrada ----------------------------------------------------------------

function mostrarEntrada() {
  $('#tela-painel').hidden = true
  $('#tela-entrada').hidden = false
}

function mostrarPainel() {
  $('#tela-entrada').hidden = true
  $('#tela-painel').hidden = false
  carregarImprensa()
  carregarInstagram()
  carregarMensagens()
}

$('#form-entrada').addEventListener('submit', async (e) => {
  e.preventDefault()
  const erro = $('#erro-entrada')
  erro.hidden = true
  const dados = Object.fromEntries(new FormData(e.target))
  try {
    await api('entrar', { method: 'POST', body: JSON.stringify(dados) })
    e.target.reset()
    mostrarPainel()
  } catch (falha) {
    erro.textContent = falha.message
    erro.hidden = false
  }
})

$('#btn-sair').addEventListener('click', async () => {
  await api('sair', { method: 'POST' })
  mostrarEntrada()
})

// --- abas -------------------------------------------------------------------

for (const aba of document.querySelectorAll('.aba')) {
  aba.addEventListener('click', () => {
    for (const outra of document.querySelectorAll('.aba')) {
      const ativa = outra === aba
      outra.setAttribute('aria-selected', String(ativa))
      $(`#painel-${outra.dataset.painel}`).hidden = !ativa
    }
  })
}

// --- imprensa ---------------------------------------------------------------

let materias = []

function desenharImprensa() {
  const lista = $('#lista-materias')
  lista.replaceChildren()

  if (!materias.length) {
    lista.append(criar('li', {
      className: 'vazio',
      textContent: 'Nenhuma matéria ainda. Clique em "Adicionar matéria" para começar.',
    }))
    return
  }

  materias.forEach((materia, i) => {
    const item = criar('li', { className: 'materia' })

    const campo = (rotulo, chave, dica = '') => {
      const label = criar('label', { textContent: rotulo })
      const input = criar('input', { value: materia[chave] ?? '', placeholder: dica })
      input.addEventListener('input', () => { materias[i][chave] = input.value })
      label.append(input)
      return label
    }

    const linha1 = criar('div', { className: 'materia__linha' })
    linha1.append(campo('Título da matéria', 'titulo', 'Como saiu publicado'))

    const linha2 = criar('div', { className: 'materia__linha materia__linha--dupla' })
    linha2.append(
      campo('Link', 'url', 'https://…'),
      campo('Veículo', 'veiculo', 'Zeca Soares'),
    )

    const linha3 = criar('div', { className: 'materia__linha materia__linha--dupla' })
    linha3.append(campo('Data (como deve aparecer)', 'data', '25 de julho de 2026'))

    const rodape = criar('div', { className: 'materia__rodape' })
    rodape.append(criar('span', { className: 'materia__ordem', textContent: `${i + 1}ª no site` }))

    const subir = criar('button', { className: 'icone', textContent: '↑ Subir', type: 'button' })
    subir.disabled = i === 0
    subir.addEventListener('click', () => {
      ;[materias[i - 1], materias[i]] = [materias[i], materias[i - 1]]
      desenharImprensa()
    })

    const descer = criar('button', { className: 'icone', textContent: '↓ Descer', type: 'button' })
    descer.disabled = i === materias.length - 1
    descer.addEventListener('click', () => {
      ;[materias[i + 1], materias[i]] = [materias[i], materias[i + 1]]
      desenharImprensa()
    })

    const remover = criar('button', { className: 'icone icone--perigo', textContent: 'Remover', type: 'button' })
    remover.addEventListener('click', () => {
      if (!confirm(`Remover "${materia.titulo || 'esta matéria'}" da lista?`)) return
      materias.splice(i, 1)
      desenharImprensa()
    })

    rodape.append(subir, descer, remover)
    item.append(linha1, linha2, linha3, rodape)
    lista.append(item)
  })
}

async function carregarImprensa() {
  try {
    const dados = await api('imprensa')
    materias = dados.itens
    desenharImprensa()
  } catch (erro) {
    avisar('#estado-imprensa', erro.message, 'erro')
  }
}

$('#btn-nova-materia').addEventListener('click', () => {
  materias.unshift({ titulo: '', veiculo: '', data: '', url: '' })
  desenharImprensa()
  $('#lista-materias input')?.focus()
})

$('#btn-salvar-imprensa').addEventListener('click', (e) =>
  comBotaoOcupado(e.currentTarget, 'Publicando…', async () => {
    try {
      const dados = await api('imprensa', { method: 'PUT', body: JSON.stringify({ itens: materias }) })
      materias = dados.itens
      desenharImprensa()
      avisar('#estado-imprensa', `${dados.mensagem} Já está no ar.`)
    } catch (erro) {
      avisar('#estado-imprensa', erro.message, 'erro')
    }
  })
)

// --- instagram --------------------------------------------------------------

let posts = []
let ocultos = new Set()
let fixados = []

const ROTULO_TIPO = { REEL: 'Reels', VIDEO: 'Vídeo', CARROSSEL: 'Carrossel', IMAGE: 'Foto' }

function desenharInstagram() {
  const grade = $('#grade-posts')
  grade.replaceChildren()

  if (!posts.length) {
    grade.append(criar('p', {
      className: 'vazio',
      textContent: 'Nenhuma publicação lida ainda. Clique em "Buscar agora no Instagram".',
    }))
    return
  }

  for (const post of posts) {
    const oculto = ocultos.has(post.code)
    const fixado = fixados.includes(post.code)

    const cartao = criar('article', {
      className: `post${oculto ? ' post--oculto' : ''}${fixado ? ' post--fixado' : ''}`,
    })

    const foto = criar('div', { className: 'post__foto' })
    foto.append(criar('img', { src: post.imagem, alt: '', loading: 'lazy' }))
    if (ROTULO_TIPO[post.tipo]) {
      foto.append(criar('span', { className: 'post__tipo', textContent: ROTULO_TIPO[post.tipo] }))
    }

    const corpo = criar('div', { className: 'post__corpo' })
    corpo.append(
      criar('span', { className: 'post__data', textContent: dataPorExtenso(post.data) }),
      criar('p', { className: 'post__titulo', textContent: post.titulo }),
    )

    const acoes = criar('div', { className: 'post__acoes' })

    const btnDestaque = criar('button', { className: 'alternar', textContent: '★ Destaque', type: 'button' })
    btnDestaque.setAttribute('aria-pressed', String(fixado))
    btnDestaque.addEventListener('click', () => {
      if (fixados.includes(post.code)) fixados = fixados.filter((c) => c !== post.code)
      else fixados.push(post.code)
      // destacar algo escondido não faz sentido: mostra de volta
      ocultos.delete(post.code)
      desenharInstagram()
    })

    const btnOcultar = criar('button', { className: 'alternar', textContent: oculto ? 'Oculta' : 'Ocultar', type: 'button' })
    btnOcultar.setAttribute('aria-pressed', String(oculto))
    btnOcultar.addEventListener('click', () => {
      if (ocultos.has(post.code)) ocultos.delete(post.code)
      else {
        ocultos.add(post.code)
        fixados = fixados.filter((c) => c !== post.code)
      }
      desenharInstagram()
    })

    const link = criar('a', {
      className: 'link post__link',
      href: post.permalink,
      target: '_blank',
      rel: 'noopener',
      textContent: 'Abrir ↗',
    })

    acoes.append(btnDestaque, btnOcultar, link)
    cartao.append(foto, corpo, acoes)
    grade.append(cartao)
  }
}

async function carregarInstagram() {
  try {
    const dados = await api('publicacoes')
    posts = dados.itens
    ocultos = new Set(dados.ocultos)
    fixados = dados.fixados
    desenharInstagram()
    if (dados.atualizadoEm) {
      const quando = new Date(dados.atualizadoEm)
      avisar('#estado-instagram', `Última leitura: ${quando.toLocaleString('pt-BR')}`, 'neutro')
    }
  } catch (erro) {
    avisar('#estado-instagram', erro.message, 'erro')
  }
}

$('#btn-sincronizar').addEventListener('click', (e) =>
  comBotaoOcupado(e.currentTarget, 'Buscando…', async () => {
    try {
      const dados = await api('sincronizar', { method: 'POST' })
      avisar('#estado-instagram', dados.mensagem, dados.ok ? 'ok' : 'erro')
      if (dados.ok) await carregarInstagram()
    } catch (erro) {
      avisar('#estado-instagram', erro.message, 'erro')
    }
  })
)

$('#btn-salvar-editorial').addEventListener('click', (e) =>
  comBotaoOcupado(e.currentTarget, 'Publicando…', async () => {
    try {
      const dados = await api('editorial', {
        method: 'PUT',
        body: JSON.stringify({ ocultos: [...ocultos], fixados }),
      })
      avisar('#estado-instagram', `${dados.mensagem} Já está no ar.`)
    } catch (erro) {
      avisar('#estado-instagram', erro.message, 'erro')
    }
  })
)

// --- mensagens do formulário -------------------------------------------------

const quandoPorExtenso = (iso) => {
  const d = new Date(iso)
  return d.toLocaleString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function desenharMensagens(itens, naoLidas) {
  const contador = $('#contador-mensagens')
  contador.textContent = naoLidas
  contador.hidden = naoLidas === 0

  const lista = $('#lista-mensagens')
  lista.replaceChildren()

  if (!itens.length) {
    lista.append(criar('li', {
      className: 'vazio',
      textContent: 'Nenhuma mensagem ainda. O que chegar pelo formulário do site aparece aqui.',
    }))
    return
  }

  for (const m of itens) {
    const item = criar('li', { className: `mensagem${m.lida ? '' : ' mensagem--nova'}` })

    const topo = criar('div', { className: 'mensagem__topo' })
    topo.append(
      criar('span', { className: 'mensagem__nome', textContent: m.nome }),
      criar('span', { className: 'mensagem__assunto', textContent: m.assunto }),
      criar('span', { className: 'mensagem__meta', textContent: m.cidade }),
      criar('span', { className: 'mensagem__quando', textContent: quandoPorExtenso(m.recebidaEm) }),
    )

    const contato = criar('div', { className: 'mensagem__meta' })
    // assunto e saudação já prontos: a assessoria só escreve a resposta
    const resposta = `mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.assunto} — gabinete da deputada Helena Duailibe`)}`
    contato.append(criar('a', { className: 'link', href: resposta, textContent: m.email }))

    const acoes = criar('div', { className: 'mensagem__acoes' })

    const marcar = criar('button', {
      className: 'icone',
      type: 'button',
      textContent: m.lida ? 'Marcar como não lida' : 'Marcar como lida',
    })
    marcar.addEventListener('click', () => mexerNaMensagem(m.id, m.lida ? 'nao-lida' : 'lida'))

    const apagar = criar('button', { className: 'icone icone--perigo', type: 'button', textContent: 'Apagar' })
    apagar.addEventListener('click', () => {
      if (confirm(`Apagar a mensagem de ${m.nome}? Isso não tem volta.`)) mexerNaMensagem(m.id, 'apagar')
    })

    acoes.append(marcar, apagar)
    item.append(topo, contato, criar('p', { className: 'mensagem__texto', textContent: m.mensagem }), acoes)
    lista.append(item)
  }
}

async function mexerNaMensagem(id, acao) {
  try {
    const dados = await api('mensagens', { method: 'PUT', body: JSON.stringify({ id, acao }) })
    desenharMensagens(dados.itens, dados.naoLidas)
  } catch (erro) {
    avisar('#estado-mensagens', erro.message, 'erro')
  }
}

async function carregarMensagens() {
  try {
    const dados = await api('mensagens')
    desenharMensagens(dados.itens, dados.naoLidas)
  } catch (erro) {
    avisar('#estado-mensagens', erro.message, 'erro')
  }
}

$('#btn-atualizar-mensagens').addEventListener('click', (e) =>
  comBotaoOcupado(e.currentTarget, 'Atualizando…', async () => {
    await carregarMensagens()
    avisar('#estado-mensagens', 'Lista atualizada.')
  })
)

// --- início -----------------------------------------------------------------

api('sessao').then(mostrarPainel).catch(mostrarEntrada)
