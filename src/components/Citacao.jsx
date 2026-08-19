import './citacao.css'

export default function Citacao({ texto, autoria, fonte }) {
  return (
    <figure className="citacao">
      <div className="container citacao__interno">
        <blockquote className="citacao__texto">{texto}</blockquote>
        <figcaption className="citacao__autoria">
          {autoria}
          {fonte && <span className="citacao__fonte">{fonte}</span>}
        </figcaption>
      </div>
    </figure>
  )
}
