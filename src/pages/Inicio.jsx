import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import Revelar from '../components/Revelar'
import RotuloSecao from '../components/RotuloSecao'
import Citacao from '../components/Citacao'
import CardDestaque from '../components/CardDestaque'
import Botao from '../components/Botao'
import Fonte from '../components/Fonte'
import { perfil, posicionamento } from '../content/perfil'
import { credenciais } from '../content/credenciais'
import { eixos } from '../content/eixos'
import { useDestaques, semanaPorExtenso } from '../hooks/useDestaques'
import './inicio.css'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: perfil.nomeCompleto,
  alternateName: perfil.nome,
  jobTitle: `${perfil.cargo} — ${perfil.casa}`,
  affiliation: { '@type': 'Organization', name: perfil.casa },
  memberOf: { '@type': 'PoliticalParty', name: perfil.partido },
  url: 'https://marcosleonam.github.io/helena-duailibe/',
  sameAs: [perfil.instagram, perfil.paginaAlema],
}

export default function Inicio() {
  const { itens } = useDestaques()
  const recentes = itens.slice(0, 3)

  return (
    <>
      <Seo
        descricao="Médica formada pela UFMA, ex-Secretária de Saúde do Estado e de São Luís, deputada estadual pelo Maranhão. Atuação em saúde pública, segurança no trânsito, mulheres e comunidades."
        caminho="/"
        jsonLd={jsonLd}
      />

      {/* Abertura */}
      <section className="abertura bloco-escuro">
       <div className="container">
        <div className="grade abertura__grade">
          <div className="abertura__texto" style={{ gridColumn: 'span 7' }}>
            <p className="abertura__olho">
              {perfil.cargo} — Maranhão · {perfil.partido} {perfil.numero}
            </p>
            <h1 className="abertura__titulo">
              Dra. Helena<br />Duailibe
            </h1>
            <p className="olho medida abertura__lide">
              Médica há mais de quarenta anos, dirigiu o Socorrão I, a Secretaria Municipal de Saúde
              de São Luís e a Secretaria de Estado da Saúde do Maranhão. Hoje leva essa experiência
              de gestão para a Assembleia Legislativa.
            </p>
            <div className="abertura__acoes">
              <Botao para="/atuacao" variante="claro">Conheça a atuação</Botao>
              <Botao href={perfil.instagram} variante="texto-claro">Instagram →</Botao>
            </div>

            <div className="numero">
              <span className="numero__rotulo">Deputada Estadual</span>
              <span className="numero__valor">{perfil.numero}</span>
            </div>
          </div>

          <div className="abertura__retrato" style={{ gridColumn: 'span 5' }}>
            <picture>
              <source srcSet={`${import.meta.env.BASE_URL}img/helena-retrato.webp`} type="image/webp" />
              <img
                src={`${import.meta.env.BASE_URL}img/helena-hero.jpg`}
                alt={`${perfil.nomeCompleto}, ${perfil.cargo} pelo Maranhão`}
                width={1000}
                height={1250}
                fetchPriority="high"
              />
            </picture>
          </div>
        </div>
       </div>
      </section>

      {/* Credenciais */}
      <section className="credenciais" aria-label="Credenciais">
        <div className="container credenciais__interno">
          {credenciais.map((c) => (
            <p key={c} className="credenciais__item">{c}</p>
          ))}
        </div>
      </section>

      {/* Destaques da semana */}
      {recentes.length > 0 && (
        <section className="container secao" aria-labelledby="titulo-destaques">
          <Revelar>
            <RotuloSecao>Destaques da semana</RotuloSecao>
            <div className="secao__cabecalho">
              <h2 id="titulo-destaques" className="secao__titulo">{semanaPorExtenso(recentes)}</h2>
              <Link className="secao__atalho" to="/destaques">Todos os destaques →</Link>
            </div>
          </Revelar>

          <div className="grade destaques-home">
            <div style={{ gridColumn: 'span 6' }}>
              <CardDestaque item={recentes[0]} destaque />
            </div>
            <div className="destaques-home__coluna" style={{ gridColumn: 'span 6' }}>
              {recentes.slice(1).map((item) => (
                <CardDestaque key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Eixos */}
      <section className="container secao" aria-labelledby="titulo-eixos">
        <Revelar>
          <RotuloSecao>Eixos de atuação</RotuloSecao>
          <h2 id="titulo-eixos" className="secao__titulo">No que ela trabalha</h2>
        </Revelar>

        <ol className="eixos">
          {eixos.map((eixo) => (
            <li key={eixo.slug} className="eixo">
              <span className="eixo__numero">{eixo.numero}</span>
              <div className="eixo__conteudo">
                <h3 className="eixo__titulo">{eixo.titulo}</h3>
                <p className="eixo__resumo medida">{eixo.resumo}</p>
                <p className="eixo__paragrafo medida">{eixo.paragrafos[0]}</p>
                <Link className="eixo__link" to={`/atuacao#${eixo.slug}`}>Ver projetos →</Link>
                <Fonte texto={eixo.fonte?.texto} url={eixo.fonte?.url} />
              </div>
            </li>
          ))}
        </ol>
      </section>

      <Citacao texto={posicionamento.texto} autoria={posicionamento.autoria} />

      {/* Instagram */}
      <section className="secao bloco-gelo" aria-labelledby="titulo-instagram"><div className="container">
        <Revelar>
          <RotuloSecao>Redes</RotuloSecao>
          <div className="secao__cabecalho">
            <h2 id="titulo-instagram" className="secao__titulo">Acompanhe o dia a dia do mandato</h2>
          </div>
        </Revelar>

        {recentes.length > 0 && (
          <div className="miniaturas" style={{ gridTemplateColumns: `repeat(${Math.min(recentes.length, 3)}, 1fr)` }}>
            {recentes.map((item) => (
              <a
                key={item.id}
                className="miniatura"
                href={item.permalink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`${import.meta.env.BASE_URL}${(item.imagem || '').replace(/^\//, '')}`}
                  alt={item.titulo}
                  width={400}
                  height={400}
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        )}

        <div className="instagram__chamada">
          <p className="instagram__arroba">{perfil.arroba}</p>
          <Botao href={perfil.instagram}>Seguir no Instagram</Botao>
        </div>
       </div>
      </section>
    </>
  )
}
