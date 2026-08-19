import Section from './Section'
import { trajetoria } from '../data/trajetoria'

export default function Trajetoria() {
  return (
    <Section id="trajetoria">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-verde">Trajetória</span>
          <h2 className="display mt-3 text-3xl md:text-4xl text-azul">
            Não é promessa de quem vai aprender. É currículo de quem já fez.
          </h2>
          <p className="mt-4 text-lg text-grafite/70">
            Da direção do Socorrão I à Secretaria Estadual de Saúde, a trajetória de Helena Duailibe
            é feita dentro do serviço público de saúde do Maranhão.
          </p>
        </div>

        <ol className="mt-12 relative border-l-2 border-linha pl-6 md:pl-8 space-y-8">
          {trajetoria.map((t) => (
            <li key={`${t.periodo}-${t.cargo}`} className="relative">
              <span className="absolute -left-[calc(1.5rem+5px)] md:-left-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-verde ring-4 ring-white" aria-hidden="true" />
              <div className="text-xs font-bold uppercase tracking-widest text-grafite/50">{t.periodo}</div>
              <div className="mt-1 text-lg font-bold text-azul">{t.cargo}</div>
              <div className="text-sm text-grafite/70">{t.local}</div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
