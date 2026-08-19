const itens = [
  { numero: '2º', texto: 'mandato como deputada estadual' },
  { numero: '30+', texto: 'anos de serviço público na saúde' },
  { numero: '2', texto: 'vezes Secretária de Saúde de São Luís' },
  { numero: '1', texto: 'gestão à frente da Saúde do Estado' },
]

export default function Credenciais() {
  return (
    <div className="border-y border-linha bg-areia">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 gap-8 md:grid-cols-4">
        {itens.map((i) => (
          <div key={i.texto}>
            <div className="display text-3xl md:text-4xl text-azul">{i.numero}</div>
            <p className="mt-2 text-sm text-grafite/70 leading-snug">{i.texto}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
