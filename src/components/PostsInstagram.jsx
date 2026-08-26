import { useState } from 'react'
import Botao from './Botao'
import { dataPorExtenso } from '../hooks/useDestaques'
import './posts-instagram.css'

const base = (caminho) => `${import.meta.env.BASE_URL}${(caminho || '').replace(/^\//, '')}`

const ROTULO_TIPO = {
  REEL: 'Reels',
  VIDEO: 'Vídeo',
  CARROSSEL: 'Carrossel',
}

/**
 * Grade com as publicações do perfil oficial. Cada card é um link para a
 * publicação ORIGINAL no Instagram (item.permalink) — nunca para o perfil
 * genérico: quem clica numa peça específica quer aquela peça.
 *
 * As capas são servidas do nosso domínio (o robô de sincronização baixa cada
 * uma), porque URL de CDN do Instagram expira em poucos dias.
 */
export default function PostsInstagram({ itens, passo = 12 }) {
  const [visiveis, setVisiveis] = useState(passo)
  if (!itens?.length) return null

  const lista = itens.slice(0, visiveis)
  const restantes = itens.length - lista.length

  return (
    <>
      <ul className="galeria posts-ig">
        {lista.map((item) => (
          <li key={item.code || item.id} className="galeria__item">
            <a
              className="cartao"
              href={item.permalink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="cartao__foto">
                <img
                  src={base(item.imagem)}
                  alt={item.titulo}
                  width={item.largura || 1080}
                  height={item.altura || 1350}
                  loading="lazy"
                  decoding="async"
                />
                {ROTULO_TIPO[item.tipo] && (
                  <span className="posts-ig__marca">{ROTULO_TIPO[item.tipo]}</span>
                )}
              </span>
              <span className="cartao__texto">
                {item.data && <span className="data-rotulo">{dataPorExtenso(item.data)}</span>}
                <span className="cartao__titulo">{item.titulo}</span>
                <span className="cartao__acao">Ver no Instagram →</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      {restantes > 0 && (
        <div className="posts-ig__mais">
          <Botao variante="contorno" onClick={() => setVisiveis((v) => v + passo)}>
            Ver mais {restantes > passo ? passo : restantes} publicações
          </Botao>
        </div>
      )}
    </>
  )
}
