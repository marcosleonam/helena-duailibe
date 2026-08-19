import { useEffect, useRef, useState } from 'react'

/**
 * Única animação de entrada do site: fade + 8px, uma vez só,
 * aplicada aos blocos principais de cada seção.
 */
export default function Revelar({ as: Tag = 'div', className = '', children, ...resto }) {
  const ref = useRef(null)
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const alvo = ref.current
    if (!alvo) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisivel(true)
      return
    }
    if (typeof IntersectionObserver === 'undefined') {
      setVisivel(true)
      return
    }
    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true)
          obs.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    obs.observe(alvo)
    // Rede de segurança: conteúdo nunca fica invisível se o observer não disparar.
    const prazo = setTimeout(() => setVisivel(true), 1200)
    return () => { clearTimeout(prazo); obs.disconnect() }
  }, [])

  return (
    <Tag ref={ref} className={`revelar ${visivel ? 'visivel' : ''} ${className}`.trim()} {...resto}>
      {children}
    </Tag>
  )
}
