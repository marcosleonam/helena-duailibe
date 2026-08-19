import { Link } from 'react-router-dom'
import { dataPorExtenso } from '../hooks/useDestaques'
import './destaques.css'

export default function CardDestaque({ item, destaque = false }) {
  const imagem = item.imagem?.startsWith('http')
    ? item.imagem
    : `${import.meta.env.BASE_URL}${(item.imagem || '').replace(/^\//, '')}`

  return (
    <article className={`destaque ${destaque ? 'destaque--principal' : ''}`}>
      {item.imagem && (
        <Link to={`/destaques/${item.slug}`} className="destaque__foto" tabIndex={-1} aria-hidden="true">
          <img
            src={imagem}
            alt=""
            width={destaque ? 900 : 600}
            height={destaque ? 600 : 400}
            loading="lazy"
          />
        </Link>
      )}
      <div className="destaque__texto">
        <p className="data-rotulo">{dataPorExtenso(item.data)}</p>
        <h3 className="destaque__titulo">
          <Link to={`/destaques/${item.slug}`}>{item.titulo}</Link>
        </h3>
        {item.resumo && <p className="destaque__resumo">{item.resumo}</p>}
        {item.permalink && (
          <a className="destaque__link" href={item.permalink} target="_blank" rel="noopener noreferrer">
            Ver no Instagram →
          </a>
        )}
      </div>
    </article>
  )
}
