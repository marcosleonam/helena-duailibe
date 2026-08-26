import Seo from '../components/Seo'
import RotuloSecao from '../components/RotuloSecao'
import Videos from '../components/Videos'
import GaleriaCampanha from '../components/GaleriaCampanha'
import PostsInstagram from '../components/PostsInstagram'
import Botao from '../components/Botao'
import { perfil } from '../content/perfil'
import { videos, galeria } from '../content/campanha'
import { useInstagram } from '../hooks/useInstagram'
import { dataPorExtenso } from '../hooks/useDestaques'
import './pagina.css'

export default function Campanha() {
  const { itens: posts, atualizadoEm } = useInstagram()

  return (
    <>
      <Seo
        titulo="A campanha nas ruas"
        descricao="Vídeos e fotos das caminhadas, do Comitê Central e das ações de rua da candidatura da Dra. Helena Duailibe a deputada estadual pelo Maranhão."
        caminho="/campanha"
        imagem="/img/campanha/missao-maranhao.jpg"
      />

      <div className="container pagina">
        <header className="pagina__cabecalho" style={{ display: 'block' }}>
          <RotuloSecao>Campanha 2026</RotuloSecao>
          <h1 className="pagina__titulo">A campanha nas ruas</h1>
          <p className="olho medida" style={{ marginTop: 'var(--e-6)' }}>
            O registro do corpo a corpo: caminhadas, o Comitê Central de portas abertas e as peças
            publicadas no perfil oficial. Tudo com link para a publicação original.
          </p>
        </header>

        {videos.length > 0 && (
          <section aria-labelledby="titulo-videos" style={{ marginBottom: 'var(--e-24)' }}>
            <RotuloSecao>Vídeos</RotuloSecao>
            <h2 id="titulo-videos" className="secao__titulo" style={{ marginBottom: 'var(--e-12)' }}>
              A rua em movimento
            </h2>
            <Videos itens={videos} />
          </section>
        )}

        <section aria-labelledby="titulo-galeria">
          <RotuloSecao>Peças e registros</RotuloSecao>
          <h2 id="titulo-galeria" className="secao__titulo" style={{ marginBottom: 'var(--e-12)' }}>
            Cards da campanha
          </h2>
          <GaleriaCampanha itens={galeria} />
        </section>

        {posts.length > 0 && (
          <section aria-labelledby="titulo-instagram" style={{ marginTop: 'var(--e-24)' }}>
            <RotuloSecao>Direto do perfil oficial</RotuloSecao>
            <h2 id="titulo-instagram" className="secao__titulo" style={{ marginBottom: 'var(--e-4)' }}>
              Tudo que saiu no Instagram
            </h2>
            <p className="meta" style={{ marginBottom: 'var(--e-12)' }}>
              {posts.length} publicações
              {atualizadoEm && ` · atualizado em ${dataPorExtenso(atualizadoEm.slice(0, 10))}`}
              {' '}· cada card abre a publicação original em {perfil.arroba}
            </p>
            <PostsInstagram itens={posts} />
          </section>
        )}

        <div className="chamada-instagram" style={{ marginTop: 'var(--e-24)' }}>
          <div>
            <p className="chamada-instagram__titulo">Acompanhe o dia a dia da campanha</p>
            <p className="chamada-instagram__texto">
              As agendas, os bairros visitados e as peças novas saem primeiro no perfil oficial
              {' '}{perfil.arroba}.
            </p>
          </div>
          <Botao href={perfil.instagram}>Seguir {perfil.arroba}</Botao>
        </div>
      </div>
    </>
  )
}
