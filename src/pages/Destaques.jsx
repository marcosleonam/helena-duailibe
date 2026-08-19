import { useMemo, useState } from 'react'
import Seo from '../components/Seo'
import RotuloSecao from '../components/RotuloSecao'
import CardDestaque from '../components/CardDestaque'
import Botao from '../components/Botao'
import { perfil } from '../content/perfil'
import { useDestaques, agruparPorSemana } from '../hooks/useDestaques'
import './pagina.css'
import './destaques-pagina.css'

const POR_PAGINA = 12
const MESES = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']

export default function Destaques() {
  const { carregando, itens } = useDestaques()
  const [mes, setMes] = useState('todos')
  const [limite, setLimite] = useState(POR_PAGINA)

  const meses = useMemo(() => {
    const set = new Set(itens.map((i) => i.data?.slice(0, 7)).filter(Boolean))
    return [...set].sort().reverse()
  }, [itens])

  const filtrados = mes === 'todos' ? itens : itens.filter((i) => i.data?.startsWith(mes))
  const visiveis = filtrados.slice(0, limite)
  const grupos = agruparPorSemana(visiveis)

  return (
    <>
      <Seo
        titulo="Destaques da semana"
        descricao="Arquivo do que a deputada estadual Helena Duailibe fez a cada semana, agrupado por período e com link para a publicação original no Instagram."
        caminho="/destaques"
      />

      <div className="container pagina">
        <header className="pagina__cabecalho" style={{ display: 'block' }}>
          <RotuloSecao>Arquivo</RotuloSecao>
          <h1 className="pagina__titulo">Destaques da semana</h1>
          <p className="olho medida" style={{ marginTop: 'var(--e-6)' }}>
            O que foi feito a cada semana, com link para a publicação original no Instagram.
          </p>
        </header>

        {!carregando && itens.length === 0 && (
          <div className="destaques-vazio">
            <p style={{ marginBottom: 'var(--e-4)' }}>
              Os destaques desta seção são publicados semanalmente a partir do perfil oficial.
              Enquanto o primeiro lote não é publicado, acompanhe pelo Instagram.
            </p>
            <Botao href={perfil.instagram}>Ver {perfil.arroba}</Botao>
          </div>
        )}

        {itens.length > 0 && (
          <>
            <div className="filtro" role="group" aria-label="Filtrar por mês">
              <button
                type="button"
                className={`filtro__item ${mes === 'todos' ? 'ativo' : ''}`}
                aria-pressed={mes === 'todos'}
                onClick={() => { setMes('todos'); setLimite(POR_PAGINA) }}
              >
                Todos
              </button>
              {meses.map((m) => {
                const [ano, mm] = m.split('-')
                return (
                  <button
                    key={m}
                    type="button"
                    className={`filtro__item ${mes === m ? 'ativo' : ''}`}
                    aria-pressed={mes === m}
                    onClick={() => { setMes(m); setLimite(POR_PAGINA) }}
                  >
                    {MESES[Number(mm) - 1]} de {ano}
                  </button>
                )
              })}
            </div>

            <div className="semanas">
              {grupos.map((grupo) => (
                <section key={grupo.chave} className="semana" aria-label={grupo.titulo}>
                  <h2 className="semana__titulo">{grupo.titulo}</h2>
                  <div className="semana__itens">
                    {grupo.itens.map((item) => (
                      <CardDestaque key={item.id} item={item} />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {filtrados.length > limite && (
              <div style={{ marginTop: 'var(--e-16)' }}>
                <Botao variante="contorno" onClick={() => setLimite((l) => l + POR_PAGINA)}>
                  Carregar mais
                </Botao>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
