import { useRef, useState } from 'react'
import { dataPorExtenso } from '../hooks/useDestaques'
import './videos.css'

const base = (caminho) => `${import.meta.env.BASE_URL}${(caminho || '').replace(/^\//, '')}`

/**
 * Vídeo vertical com cartaz próprio: o arquivo só é baixado quando a pessoa
 * toca em "Assistir" (preload="none"), para não pesar o 4G de quem abre o site
 * no celular. Depois do primeiro play, ficam os controles nativos.
 */
function Video({ item }) {
  const ref = useRef(null)
  const [tocando, setTocando] = useState(false)

  function iniciar() {
    setTocando(true)
    // o play precisa vir no mesmo gesto do toque, senão o iOS bloqueia
    const el = ref.current
    if (el) { el.play().catch(() => {}) }
  }

  return (
    <article className="video">
      <div className={`video__moldura ${tocando ? 'video__moldura--ativa' : ''}`}>
        <video
          ref={ref}
          className="video__player"
          src={base(item.arquivo)}
          poster={base(item.poster)}
          preload="none"
          controls={tocando}
          playsInline
          onPlay={() => setTocando(true)}
        />
        {!tocando && (
          <button type="button" className="video__play" onClick={iniciar}>
            <span className="video__play-icone" aria-hidden="true" />
            <span className="video__play-texto">Assistir</span>
            <span className="sr-apenas">— {item.titulo}</span>
          </button>
        )}
      </div>

      <div className="video__texto">
        {item.data && <p className="data-rotulo">{dataPorExtenso(item.data)}</p>}
        <h3 className="video__titulo">{item.titulo}</h3>
        {item.resumo && <p className="video__resumo">{item.resumo}</p>}
        {item.permalink && (
          <a className="video__link" href={item.permalink} target="_blank" rel="noopener noreferrer">
            Ver no Instagram →
          </a>
        )}
      </div>
    </article>
  )
}

export default function Videos({ itens }) {
  if (!itens?.length) return null
  // com um vídeo só a grade de colunas deixa meia tela vazia — nesse caso
  // o card vira horizontal (vídeo à esquerda, texto ao lado)
  return (
    <div className={`videos ${itens.length === 1 ? 'videos--unico' : ''}`}>
      {itens.map((item) => <Video key={item.id} item={item} />)}
    </div>
  )
}
