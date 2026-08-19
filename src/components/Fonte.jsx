/** Citação de fonte: 13px cinza, com link quando existir. */
export default function Fonte({ texto, url }) {
  if (!texto) return null
  return (
    <p className="meta" style={{ marginTop: 'var(--e-3)' }}>
      Fonte:{' '}
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer">{texto}</a>
      ) : (
        texto
      )}
    </p>
  )
}
