/** Gesto visual assinatura: filete de 2px na cor de acento + rótulo em caixa alta. */
export default function RotuloSecao({ children, id }) {
  return (
    <div className="rotulo-secao">
      <span id={id}>{children}</span>
    </div>
  )
}
