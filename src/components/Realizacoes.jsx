import { useMemo, useState } from 'react'
import { MapPin, AlertTriangle } from 'lucide-react'
import Section from './Section'
import { realizacoes, realizacoesSaoExemplo } from '../data/realizacoes'

export default function Realizacoes() {
  const municipios = useMemo(
    () => ['Todos', ...Array.from(new Set(realizacoes.map((r) => r.municipio))).sort((a, b) => a.localeCompare(b, 'pt-BR'))],
    []
  )
  const [filtro, setFiltro] = useState('Todos')

  const lista = filtro === 'Todos' ? realizacoes : realizacoes.filter((r) => r.municipio === filtro)

  return (
    <Section id="realizacoes">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-verde">Realizações</span>
          <h2 className="display mt-3 text-3xl md:text-4xl text-azul">O que chegou em cada município</h2>
          <p className="mt-4 text-lg text-grafite/70">
            Escolha o seu município e veja o que foi destinado e executado.
          </p>
        </div>

        {realizacoesSaoExemplo && (
          <div className="mt-8 flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <AlertTriangle size={20} className="shrink-0" />
            <p>
              <strong>Conteúdo de exemplo.</strong> Substitua os itens em <code>src/data/realizacoes.js</code> por
              emendas e ações reais, com valor e ano conferidos, antes de publicar. Depois troque
              <code> realizacoesSaoExemplo</code> para <code>false</code> para sumir com este aviso.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filtrar por município">
          {municipios.map((m) => (
            <button
              key={m}
              onClick={() => setFiltro(m)}
              aria-pressed={filtro === m}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-azul focus-visible:outline-none ${
                filtro === m ? 'bg-azul text-white' : 'bg-areia text-grafite/70 hover:bg-linha'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lista.map((r) => (
            <article key={`${r.municipio}-${r.titulo}`} className="flex flex-col overflow-hidden rounded-2xl border border-linha bg-white">
              {r.foto && (
                <img src={r.foto} alt={r.titulo} className="h-44 w-full object-cover" loading="lazy" />
              )}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-verde">
                  <MapPin size={13} /> {r.municipio} · {r.ano}
                </div>
                <h3 className="mt-3 text-lg font-bold leading-snug text-azul">{r.titulo}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-grafite/70">{r.texto}</p>
                {r.valor && (
                  <div className="mt-4 border-t border-linha pt-4 text-sm font-bold text-azul">{r.valor}</div>
                )}
              </div>
            </article>
          ))}
        </div>

        {lista.length === 0 && (
          <p className="mt-8 text-grafite/60">Nenhuma ação cadastrada para este município ainda.</p>
        )}
      </div>
    </Section>
  )
}
