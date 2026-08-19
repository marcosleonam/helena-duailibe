import Seo from '../components/Seo'
import RotuloSecao from '../components/RotuloSecao'
import Revelar from '../components/Revelar'
import Fonte from '../components/Fonte'
import { biografia } from '../content/biografia'
import { perfil } from '../content/perfil'
import './pagina.css'

export default function Biografia() {
  return (
    <>
      <Seo
        titulo="Quem é a Dra. Helena"
        descricao="Médica formada pela UFMA com residência em Medicina Comunitária e de Família. Mais de quatro décadas na saúde pública maranhense, do Socorrão I à Secretaria de Estado."
        caminho="/biografia"
      />

      <article className="container pagina">
        <header className="grade pagina__cabecalho">
          <div style={{ gridColumn: 'span 7' }}>
            <RotuloSecao>Quem é</RotuloSecao>
            <h1 className="pagina__titulo">Uma médica dentro da saúde pública do Maranhão</h1>
          </div>
          <div style={{ gridColumn: '9 / span 4' }}>
            <p className="olho">{biografia.olho}</p>
          </div>
        </header>

        <div className="grade">
          <figure className="pagina__figura" style={{ gridColumn: 'span 5' }}>
            <picture>
              <source srcSet={`${import.meta.env.BASE_URL}img/helena-retrato.webp`} type="image/webp" />
              <img
                src={`${import.meta.env.BASE_URL}img/helena-hero.jpg`}
                alt={`${perfil.nomeCompleto} em seu gabinete`}
                width={1000}
                height={1250}
                loading="lazy"
              />
            </picture>
          </figure>

          <Revelar className="pagina__texto" style={{ gridColumn: '7 / span 6' }}>
            {biografia.paragrafos.map((p, i) => (
              <p key={i} className="pagina__paragrafo medida">{p}</p>
            ))}
            {biografia.fontes.map((f) => (
              <Fonte key={f.url} texto={f.texto} url={f.url} />
            ))}
          </Revelar>
        </div>
      </article>
    </>
  )
}
