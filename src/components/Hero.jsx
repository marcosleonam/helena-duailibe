import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Stethoscope, Image as ImageIcon } from 'lucide-react'
import { site, whatsappLink } from '../config'

export default function Hero() {
  const [semFoto, setSemFoto] = useState(false)

  return (
    <section id="topo" className="relative overflow-hidden bg-azul text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(15,157,88,0.35),transparent_60%)]" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24 grid gap-12 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest">
            <Stethoscope size={14} /> Médica · {site.partido} · {site.estado}
          </span>

          <h1 className="display mt-6 text-4xl sm:text-5xl lg:text-6xl">
            Quem já cuidou<br />da saúde do Maranhão<br />
            <span className="text-verde-2">sabe o que precisa ser feito.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-white/80">
            {site.nome} é médica formada pela UFMA, foi Secretária de Saúde do Estado e de São Luís,
            vice-prefeita da capital e hoje é {site.cargo.toLowerCase()} e Procuradora da Mulher na Assembleia Legislativa.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-4">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-verde px-7 py-4 text-sm font-bold uppercase tracking-wide text-white hover:bg-verde-2 hover:scale-[1.02] transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              Falar com a equipe <ArrowRight size={18} />
            </a>
            <a
              href="#realizacoes"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-4 text-sm font-bold uppercase tracking-wide text-white hover:bg-white/10 transition-colors"
            >
              Ver realizações
            </a>
          </div>

          <div className="mt-10 inline-flex items-center gap-3 rounded-2xl bg-white px-5 py-3 text-azul">
            <span className="text-xs font-semibold uppercase tracking-widest text-azul/60">Deputada Estadual</span>
            <span className="display text-3xl">{site.numero}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          className="relative"
        >
          <div className="aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/15 bg-white/10">
            {/* TROCAR: colocar a foto vertical em public/img/helena-hero.jpg */}
            {semFoto ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-8 text-center text-white/50">
                <ImageIcon size={40} />
                <p className="text-sm">
                  Foto vertical da candidata<br />
                  <code className="text-xs">public/img/helena-hero.jpg</code>
                </p>
              </div>
            ) : (
              <img
                src="./img/helena-hero.jpg"
                alt={`${site.nomeCompleto}, ${site.cargo} pelo ${site.estado}`}
                className="h-full w-full object-cover"
                onError={() => setSemFoto(true)}
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
