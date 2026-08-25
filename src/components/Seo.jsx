import { perfil } from '../content/perfil'

const BASE_URL = 'https://helenaduailibe.com.br'

/**
 * Metadados por página. O React 19 iça title/meta/link para o <head>
 * automaticamente, sem precisar de biblioteca externa.
 */
export default function Seo({ titulo, descricao, caminho = '/', imagem, tipo = 'website', jsonLd }) {
  const url = `${BASE_URL}${caminho}`
  const capa = imagem ? `${BASE_URL}${imagem}` : `${BASE_URL}/img/card-campanha.jpg`
  const tituloCompleto = titulo
    ? `${titulo} — ${perfil.nome}`
    : `${perfil.nome} — ${perfil.cargo} pelo Maranhão`

  return (
    <>
      <title>{tituloCompleto}</title>
      <meta name="description" content={descricao} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={tipo} />
      <meta property="og:title" content={tituloCompleto} />
      <meta property="og:description" content={descricao} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={capa} />
      <meta property="og:locale" content="pt_BR" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={tituloCompleto} />
      <meta name="twitter:description" content={descricao} />
      <meta name="twitter:image" content={capa} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </>
  )
}
