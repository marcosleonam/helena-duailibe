import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { site, whatsappLink } from '../config'

const links = [
  { href: '#trajetoria', label: 'Trajetória' },
  { href: '#pautas', label: 'Pautas' },
  { href: '#realizacoes', label: 'Realizações' },
  { href: '#contato', label: 'Contato' },
]

export default function Header() {
  const [aberto, setAberto] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-linha">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#topo" className="flex items-baseline gap-2">
          <span className="display text-lg text-azul">Helena Duailibe</span>
          <span className="text-sm font-bold text-verde">{site.numero}</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-grafite/80 hover:text-azul transition-colors">
              {l.label}
            </a>
          ))}
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-verde px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-verde-2 transition-colors focus-visible:ring-2 focus-visible:ring-azul focus-visible:outline-none"
          >
            Falar com a equipe
          </a>
        </nav>

        <button
          onClick={() => setAberto((v) => !v)}
          className="md:hidden p-2 text-azul focus-visible:ring-2 focus-visible:ring-azul focus-visible:outline-none rounded"
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={aberto}
        >
          {aberto ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {aberto && (
        <nav className="md:hidden border-t border-linha bg-white px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setAberto(false)} className="text-base font-medium text-grafite">
              {l.label}
            </a>
          ))}
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-verde px-5 py-3 text-center text-sm font-bold uppercase tracking-wide text-white"
          >
            Falar com a equipe
          </a>
        </nav>
      )}
    </header>
  )
}
