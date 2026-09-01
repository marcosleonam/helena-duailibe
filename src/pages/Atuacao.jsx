import Seo from '../components/Seo'
import RotuloSecao from '../components/RotuloSecao'
import Revelar from '../components/Revelar'
import Fonte from '../components/Fonte'
import { eixos, fechamentoAtuacao } from '../content/eixos'
import './pagina.css'

export default function Atuacao() {
  return (
    <>
      <Seo
        titulo="Atuação parlamentar"
        descricao="Saúde pública, segurança no trânsito, mulheres e proteção social, desenvolvimento e comunidades: os quatro eixos de atuação da deputada estadual Helena Duailibe na Assembleia Legislativa do Maranhão."
        caminho="/atuacao"
      />

      <div className="container pagina">
        <header className="grade pagina__cabecalho">
          <div style={{ gridColumn: 'span 7' }}>
            <RotuloSecao>Atuação parlamentar</RotuloSecao>
            <h1 className="pagina__titulo">Quatro eixos, uma origem comum</h1>
          </div>
          <div style={{ gridColumn: '9 / span 4' }}>
            <p className="olho">
              A pauta legislativa nasce da gestão: o que ela viu funcionar — e faltar — nos quarenta
              anos dentro da saúde pública maranhense.
            </p>
          </div>
        </header>

        <ol className="atuacao" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {eixos.filter((e) => !e.pendente).map((eixo) => (
            <li key={eixo.slug} id={eixo.slug} className="atuacao__eixo">
              <span className="atuacao__numero">{eixo.numero}</span>
              <Revelar>
                <h2 className="atuacao__titulo">{eixo.titulo}</h2>
                <p className="olho medida" style={{ marginBottom: 'var(--e-6)' }}>{eixo.resumo}</p>
                <div className="atuacao__paragrafos">
                  {eixo.paragrafos.map((p, i) => (
                    <p key={i} className="medida">{p}</p>
                  ))}
                </div>
                <Fonte texto={eixo.fonte?.texto} url={eixo.fonte?.url} />
              </Revelar>
              {/* `eixo.confirmar` é anotação NOSSA sobre dado ainda não checado.
                  Fica só no código (e no README) — nunca na tela do eleitor. */}
              <div className="atuacao__lateral" />
            </li>
          ))}
        </ol>

        <p className="olho medida" style={{ marginTop: 'var(--e-16)' }}>
          “{fechamentoAtuacao.texto}”
        </p>
        <Fonte texto={fechamentoAtuacao.fonte} />
      </div>
    </>
  )
}
