import { Link, useParams } from 'react-router-dom'
import Seo from '../components/Seo'
import RotuloSecao from '../components/RotuloSecao'
import Botao from '../components/Botao'
import { perfil } from '../content/perfil'
import { useDestaques, dataPorExtenso } from '../hooks/useDestaques'
import './pagina.css'

export default function DestaqueDetalhe() {
  const { slug } = useParams()
  const { carregando, itens } = useDestaques()
  const item = itens.find((i) => i.slug === slug)

  if (carregando) {
    return (
      <div className="container pagina">
        <p className="meta">Carregando…</p>
      </div>
    )
  }

  if (!item) {
    return (
      <>
        <Seo titulo="Destaque não encontrado" descricao="O destaque procurado não está disponível." caminho={`/destaques/${slug}`} />
        <div className="container pagina">
          <RotuloSecao>Destaques</RotuloSecao>
          <h1 className="pagina__titulo">Destaque não encontrado</h1>
          <p className="olho medida" style={{ marginTop: 'var(--e-6)', marginBottom: 'var(--e-8)' }}>
            Este destaque pode ter sido removido ou o endereço está incorreto.
          </p>
          <Botao para="/destaques">Ver todos os destaques</Botao>
        </div>
      </>
    )
  }

  const imagem = item.imagem?.startsWith('http')
    ? item.imagem
    : `${import.meta.env.BASE_URL}${(item.imagem || '').replace(/^\//, '')}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: item.titulo,
    datePublished: item.data,
    description: item.resumo,
    image: imagem,
    author: { '@type': 'Person', name: perfil.nomeCompleto },
  }

  return (
    <>
      <Seo
        titulo={item.titulo}
        descricao={item.resumo || item.titulo}
        caminho={`/destaques/${item.slug}`}
        imagem={item.imagem}
        tipo="article"
        jsonLd={jsonLd}
      />

      <article className="container pagina">
        <p className="meta" style={{ marginBottom: 'var(--e-6)' }}>
          <Link to="/destaques">← Todos os destaques</Link>
        </p>

        <header style={{ marginBottom: 'var(--e-12)' }}>
          <RotuloSecao>{dataPorExtenso(item.data)}</RotuloSecao>
          <h1 className="pagina__titulo" style={{ maxWidth: '22ch' }}>{item.titulo}</h1>
        </header>

        {item.imagem && (
          <figure style={{ margin: '0 0 var(--e-12)' }}>
            <img src={imagem} alt={item.titulo} width={1200} height={800} style={{ width: '100%', aspectRatio: '3 / 2', objectFit: 'cover' }} />
          </figure>
        )}

        {item.resumo && <p className="olho medida" style={{ marginBottom: 'var(--e-12)' }}>{item.resumo}</p>}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--e-4)' }}>
          {item.permalink && <Botao href={item.permalink}>Ver publicação original no Instagram</Botao>}
          <Botao href={perfil.instagram} variante="contorno">Seguir {perfil.arroba}</Botao>
        </div>
      </article>
    </>
  )
}
