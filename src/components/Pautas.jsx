import Section from './Section'
import { HeartPulse, HandHeart, Users, Home } from 'lucide-react'
import { pautas } from '../data/pautas'

const icones = { HeartPulse, HandHeart, Users, Home }

export default function Pautas() {
  return (
    <Section id="pautas" className="bg-areia">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-verde">Pautas</span>
          <h2 className="display mt-3 text-3xl md:text-4xl text-azul">No que ela trabalha</h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {pautas.map((p) => {
            const Icone = icones[p.icone] ?? HeartPulse
            return (
              <div key={p.titulo} className="rounded-2xl border border-linha bg-white p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-azul text-white">
                  <Icone size={22} />
                </div>
                <h3 className="mt-5 text-xl font-bold text-azul">{p.titulo}</h3>
                <p className="mt-3 text-grafite/70 leading-relaxed">{p.texto}</p>
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
