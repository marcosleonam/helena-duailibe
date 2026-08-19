import { Link } from 'react-router-dom'
import './botao.css'

export default function Botao({ para, href, variante = 'primario', children, ...resto }) {
  const classe = `botao botao--${variante}`
  if (href) {
    return (
      <a className={classe} href={href} target="_blank" rel="noopener noreferrer" {...resto}>
        {children}
      </a>
    )
  }
  if (para) {
    return <Link className={classe} to={para} {...resto}>{children}</Link>
  }
  return <button className={classe} {...resto}>{children}</button>
}
