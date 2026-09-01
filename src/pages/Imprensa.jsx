import Seo from '../components/Seo'
import RotuloSecao from '../components/RotuloSecao'
import Revelar from '../components/Revelar'
import { useImprensa } from '../hooks/useImprensa'
import './pagina.css'
import './imprensa.css'

export default function Imprensa() {
  const imprensa = useImprensa()

  return (
    <>
      <Seo
        titulo="Na imprensa"
        descricao="O que a imprensa maranhense publicou sobre a atuação da deputada estadual Helena Duailibe: saúde pública, seminários, projetos e mandato."
        caminho="/imprensa"
      />

      <div className="container pagina">
        <header className="pagina__cabecalho" style={{ display: 'block' }}>
          <RotuloSecao>Na imprensa</RotuloSecao>
          <h1 className="pagina__titulo">O que dizem sobre o mandato</h1>
          <p className="olho medida" style={{ marginTop: 'var(--e-6)' }}>
            Matérias publicadas por veículos maranhenses e pela própria Assembleia Legislativa.
            Cada título abre a publicação original.
          </p>
        </header>

        <Revelar as="ul" className="clipping">
          {imprensa.map((item) => (
            <li key={item.url} className="clipping__item">
              <div className="clipping__meta">
                <span className="clipping__veiculo">{item.veiculo}</span>
                <span className="clipping__data">{item.data}</span>
              </div>
              <h2 className="clipping__titulo">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.titulo}
                </a>
              </h2>
              <span className="clipping__seta" aria-hidden="true">↗</span>
            </li>
          ))}
        </Revelar>
      </div>
    </>
  )
}
