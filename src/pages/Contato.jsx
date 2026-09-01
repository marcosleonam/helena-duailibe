import { useState } from 'react'
import Seo from '../components/Seo'
import RotuloSecao from '../components/RotuloSecao'
import Botao from '../components/Botao'
import { perfil } from '../content/perfil'
import './pagina.css'

// O envio vai para o nosso próprio painel (painel/servidor.mjs), e a
// assessoria lê as mensagens na aba "Mensagens" de /admin. Escolhido no lugar
// de Formspree/Web3Forms porque gasto de campanha tem que sair da conta
// eleitoral — e isto aqui não custa nada nem depende de terceiro.
const ENDPOINT = '/api/contato'

const ASSUNTOS = ['Saúde', 'Assistência Social', 'Sugestão de projeto', 'Agenda', 'Outro']

const VAZIO = { nome: '', email: '', cidade: '', assunto: ASSUNTOS[0], mensagem: '', mel: '' }

export default function Contato() {
  const [dados, setDados] = useState(VAZIO)
  const [erros, setErros] = useState({})
  const [estado, setEstado] = useState('parado') // parado | enviando | ok | erro

  function validar(campo, valor) {
    if (campo === 'nome' && valor.trim().length < 2) return 'Informe seu nome.'
    if (campo === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) return 'Informe um e-mail válido.'
    if (campo === 'cidade' && valor.trim().length < 2) return 'Informe sua cidade.'
    if (campo === 'mensagem' && valor.trim().length < 10) return 'Escreva pelo menos uma frase.'
    return ''
  }

  function aoDigitar(campo, valor) {
    setDados((d) => ({ ...d, [campo]: valor }))
    if (erros[campo]) setErros((e) => ({ ...e, [campo]: validar(campo, valor) }))
  }

  async function enviar(e) {
    e.preventDefault()
    const novos = {}
    for (const campo of ['nome', 'email', 'cidade', 'mensagem']) {
      const erro = validar(campo, dados[campo])
      if (erro) novos[campo] = erro
    }
    setErros(novos)
    if (Object.keys(novos).length > 0) return
    if (dados.mel) return // honeypot

    if (!ENDPOINT) {
      setEstado('erro')
      return
    }

    setEstado('enviando')
    try {
      const resposta = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(dados),
      })
      if (!resposta.ok) throw new Error('falha')
      setEstado('ok')
      setDados(VAZIO)
    } catch {
      setEstado('erro')
    }
  }

  return (
    <>
      <Seo
        titulo="Contato e gabinete"
        descricao="Fale com o gabinete da deputada estadual Helena Duailibe na Assembleia Legislativa do Maranhão."
        caminho="/contato"
      />

      <div className="container pagina">
        <header className="pagina__cabecalho" style={{ display: 'block' }}>
          <RotuloSecao>Contato</RotuloSecao>
          <h1 className="pagina__titulo">Fale com o gabinete</h1>
        </header>

        <div className="grade">
          <div style={{ gridColumn: 'span 7' }}>
            <form className="form" onSubmit={enviar} noValidate>
              {[
                { id: 'nome', rotulo: 'Nome', tipo: 'text', auto: 'name' },
                { id: 'email', rotulo: 'E-mail', tipo: 'email', auto: 'email' },
                { id: 'cidade', rotulo: 'Cidade', tipo: 'text', auto: 'address-level2' },
              ].map((campo) => (
                <div key={campo.id} className={`campo ${erros[campo.id] ? 'campo--invalido' : ''}`}>
                  <label className="campo__rotulo" htmlFor={campo.id}>{campo.rotulo}</label>
                  <input
                    id={campo.id}
                    type={campo.tipo}
                    autoComplete={campo.auto}
                    value={dados[campo.id]}
                    onChange={(e) => aoDigitar(campo.id, e.target.value)}
                    onBlur={(e) => setErros((x) => ({ ...x, [campo.id]: validar(campo.id, e.target.value) }))}
                    aria-invalid={Boolean(erros[campo.id])}
                    aria-describedby={erros[campo.id] ? `${campo.id}-erro` : undefined}
                  />
                  {erros[campo.id] && <p className="campo__erro" id={`${campo.id}-erro`}>{erros[campo.id]}</p>}
                </div>
              ))}

              <div className="campo">
                <label className="campo__rotulo" htmlFor="assunto">Assunto</label>
                <select id="assunto" value={dados.assunto} onChange={(e) => aoDigitar('assunto', e.target.value)}>
                  {ASSUNTOS.map((a) => <option key={a}>{a}</option>)}
                </select>
              </div>

              <div className={`campo ${erros.mensagem ? 'campo--invalido' : ''}`}>
                <label className="campo__rotulo" htmlFor="mensagem">Mensagem</label>
                <textarea
                  id="mensagem"
                  value={dados.mensagem}
                  onChange={(e) => aoDigitar('mensagem', e.target.value)}
                  onBlur={(e) => setErros((x) => ({ ...x, mensagem: validar('mensagem', e.target.value) }))}
                  aria-invalid={Boolean(erros.mensagem)}
                  aria-describedby={erros.mensagem ? 'mensagem-erro' : undefined}
                />
                {erros.mensagem && <p className="campo__erro" id="mensagem-erro">{erros.mensagem}</p>}
              </div>

              <div className="mel" aria-hidden="true">
                <label htmlFor="site">Não preencha este campo</label>
                <input id="site" tabIndex={-1} autoComplete="off" value={dados.mel} onChange={(e) => aoDigitar('mel', e.target.value)} />
              </div>

              <div>
                <Botao type="submit" disabled={estado === 'enviando'}>
                  {estado === 'enviando' ? 'Enviando…' : 'Enviar mensagem'}
                </Botao>
              </div>

              <p className="form__estado" role="status" aria-live="polite">
                {estado === 'ok' && 'Mensagem recebida. Retornaremos pelo e-mail informado.'}
                {estado === 'erro' && `Não foi possível enviar agora. Tente novamente ou escreva para ${perfil.gabinete.email}.`}
              </p>
            </form>
          </div>

          <div className="contato__lateral" style={{ gridColumn: '9 / span 4' }}>
            {/* bloco de dado que ainda não veio da assessoria simplesmente
                não aparece — melhor faltar do que exibir marcação interna */}
            {perfil.gabinete.endereco && (
              <dl className="contato__bloco">
                <dt>Gabinete</dt>
                <dd>{perfil.gabinete.endereco}</dd>
              </dl>
            )}
            {perfil.gabinete.telefone && (
              <dl className="contato__bloco">
                <dt>Telefone</dt>
                <dd>{perfil.gabinete.telefone}</dd>
              </dl>
            )}
            {perfil.gabinete.email && (
              <dl className="contato__bloco">
                <dt>E-mail</dt>
                <dd><a href={`mailto:${perfil.gabinete.email}`}>{perfil.gabinete.email}</a></dd>
              </dl>
            )}
            <dl className="contato__bloco">
              <dt>Redes</dt>
              <dd>
                <a href={perfil.instagram} target="_blank" rel="noopener noreferrer">Instagram {perfil.arroba}</a>
              </dd>
            </dl>
            {perfil.gabinete.whatsapp && (
              <Botao href={`https://wa.me/${perfil.gabinete.whatsapp}`} variante="contorno">
                WhatsApp do gabinete
              </Botao>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
