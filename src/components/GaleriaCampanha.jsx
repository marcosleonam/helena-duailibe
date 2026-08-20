import { perfil } from '../content/perfil'
import './galeria.css'

const base = (caminho) => `${import.meta.env.BASE_URL}${(caminho || '').replace(/^\//, '')}`

/**
 * Cards das peças de campanha (4/5, o formato em que são publicadas).
 * O card inteiro é um link para o perfil oficial — é o destino que a campanha
 * quer para esse tráfego.
 */
export default function GaleriaCampanha({ itens }) {
  if (!itens?.length) return null

  return (
    <ul className="galeria">
      {itens.map((item) => (
        <li key={item.id} className={`galeria__item ${item.destaque ? 'galeria__item--destaque' : ''}`}>
          <a
            className="cartao"
            href={item.permalink || perfil.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="cartao__foto">
              <img
                src={base(item.imagem)}
                alt={item.titulo}
                width={1000}
                height={1250}
                loading="lazy"
                decoding="async"
              />
            </span>
            <span className="cartao__texto">
              <span className="cartao__titulo">{item.titulo}</span>
              {item.legenda && <span className="cartao__legenda">{item.legenda}</span>}
              <span className="cartao__acao">Ver no Instagram →</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
