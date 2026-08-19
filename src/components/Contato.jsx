import { useState } from 'react'
import { Send } from 'lucide-react'
import Section from './Section'
import { site, whatsappLink } from '../config'

const ASSUNTOS = ['Quero apoiar a campanha', 'Preciso de ajuda com saúde', 'Demanda do meu município', 'Convite para agenda', 'Outro assunto']

export default function Contato() {
  const [form, setForm] = useState({ nome: '', municipio: '', assunto: ASSUNTOS[0], mensagem: '' })

  function enviar(e) {
    e.preventDefault()
    const texto = [
      'Contato pelo site',
      `Nome: ${form.nome}`,
      `Município: ${form.municipio}`,
      `Assunto: ${form.assunto}`,
      form.mensagem ? `Mensagem: ${form.mensagem}` : null,
    ].filter(Boolean).join('\n')
    window.open(whatsappLink(texto), '_blank', 'noopener,noreferrer')
  }

  const campo = 'w-full rounded-xl border border-linha bg-white px-4 py-3 text-grafite placeholder:text-grafite/40 focus:border-azul focus-visible:ring-2 focus-visible:ring-azul/30 focus-visible:outline-none'

  return (
    <Section id="contato" className="bg-azul text-white">
      <div className="max-w-6xl mx-auto px-6 grid gap-12 lg:grid-cols-2 lg:items-start">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-verde-2">Contato</span>
          <h2 className="display mt-3 text-3xl md:text-4xl">Fale com a equipe</h2>
          <p className="mt-4 text-lg text-white/75">
            Demanda do seu município, pedido de apoio ou convite para agenda: escreva aqui e a
            mensagem cai direto no WhatsApp da assessoria.
          </p>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-bold uppercase tracking-wide hover:bg-white/10 transition-colors"
          >
            Prefiro chamar direto no WhatsApp
          </a>
        </div>

        <form onSubmit={enviar} className="rounded-3xl bg-white p-6 md:p-8 space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-semibold text-grafite mb-1.5">Seu nome</label>
            <input id="nome" required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className={campo} placeholder="Como podemos te chamar" />
          </div>
          <div>
            <label htmlFor="municipio" className="block text-sm font-semibold text-grafite mb-1.5">Seu município</label>
            <input id="municipio" required value={form.municipio} onChange={(e) => setForm({ ...form, municipio: e.target.value })} className={campo} placeholder="Ex.: São Luís" />
          </div>
          <div>
            <label htmlFor="assunto" className="block text-sm font-semibold text-grafite mb-1.5">Assunto</label>
            <select id="assunto" value={form.assunto} onChange={(e) => setForm({ ...form, assunto: e.target.value })} className={campo}>
              {ASSUNTOS.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="mensagem" className="block text-sm font-semibold text-grafite mb-1.5">Mensagem (opcional)</label>
            <textarea id="mensagem" rows={3} value={form.mensagem} onChange={(e) => setForm({ ...form, mensagem: e.target.value })} className={campo} placeholder="Conte em poucas linhas" />
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-verde px-7 py-4 text-sm font-bold uppercase tracking-wide text-white hover:bg-verde-2 transition-colors focus-visible:ring-2 focus-visible:ring-azul focus-visible:outline-none"
          >
            Enviar pelo WhatsApp <Send size={17} />
          </button>

          <p className="text-xs leading-relaxed text-grafite/50">
            Ao enviar, o WhatsApp abre com sua mensagem já escrita. Os dados são usados apenas para
            responder este contato e não ficam armazenados neste site.
          </p>
        </form>
      </div>
    </Section>
  )
}
