import { Mail, MapPin } from 'lucide-react'

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}
import { site } from '../config'

export default function Footer() {
  return (
    <footer className="bg-grafite text-white/70">
      <div className="max-w-6xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-3">
        <div>
          <div className="display text-xl text-white">{site.nome}</div>
          <div className="mt-1 text-sm">{site.cargo} · {site.estado}</div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5">
            <span className="text-xs uppercase tracking-widest">{site.partido}</span>
            <span className="display text-lg text-white">{site.numero}</span>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="text-xs font-bold uppercase tracking-widest text-white/50">Contato</div>
          {site.instagram && (
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
              <InstagramIcon className="h-4 w-4" /> @helenaduailibe
            </a>
          )}
          <a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
            <Mail size={16} /> {site.email}
          </a>
          <div className="flex items-start gap-2">
            <MapPin size={16} className="mt-0.5 shrink-0" /> {site.cidade}/MA
          </div>
        </div>

        <div className="text-xs leading-relaxed">
          <div className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3">Identificação legal</div>
          <p>{site.legal.razaoSocial}</p>
          <p className="mt-1">CNPJ {site.legal.cnpj}</p>
          <p className="mt-1">{site.legal.endereco}</p>
          <p className="mt-4 text-white/50">
            Site oficial de campanha, mantido com recursos da campanha, nos termos do art. 57-B da
            Lei nº 9.504/97. Não é permitida a veiculação de propaganda paga de terceiros nesta página.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-5 text-xs text-white/40">
          © {new Date().getFullYear()} {site.legal.razaoSocial}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
