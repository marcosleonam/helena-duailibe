import { Link } from 'react-router-dom'
import { perfil } from '../content/perfil'
import './rodape.css'

export default function Rodape() {
  const ano = new Date().getFullYear()

  return (
    <footer className="rodape">
      <div className="container">
        <div className="rodape__colunas">
          <div>
            <div className="rotulo-secao"><span>Identificação</span></div>
            <p className="rodape__nome">{perfil.nome}</p>
            <p className="rodape__frase">
              {perfil.cargo} pelo Maranhão. Médica, ex-Secretária de Saúde do Estado e de São Luís.
            </p>
          </div>

          <div>
            <div className="rotulo-secao"><span>Navegação</span></div>
            <ul className="rodape__lista">
              <li><Link to="/">Início</Link></li>
              <li><Link to="/biografia">Quem é a Dra. Helena</Link></li>
              <li><Link to="/atuacao">Atuação parlamentar</Link></li>
              <li><Link to="/destaques">Destaques da semana</Link></li>
              <li><Link to="/imprensa">Na imprensa</Link></li>
              <li><Link to="/contato">Contato e gabinete</Link></li>
            </ul>
          </div>

          <div>
            <div className="rotulo-secao"><span>Gabinete</span></div>
            <ul className="rodape__lista">
              <li>{perfil.gabinete.endereco}</li>
              <li>Telefone: {perfil.gabinete.telefone}</li>
              <li>E-mail: {perfil.gabinete.email}</li>
              <li>
                <a href={perfil.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram {perfil.arroba}
                </a>
              </li>
              <li>
                <a href={perfil.paginaAlema} target="_blank" rel="noopener noreferrer">
                  Página oficial na {perfil.siglaCasa}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="hairline" />

        <div className="rodape__legal">
          <p>© {ano} {perfil.nome}. {perfil.partido} — {perfil.cargo}, número {perfil.numero}.</p>
          {perfil.eleitoral.exibir ? (
            <p>
              {perfil.eleitoral.responsavel} — CNPJ {perfil.eleitoral.cnpj}
            </p>
          ) : (
            <p className="rodape__reservado">
              Espaço reservado para a identificação exigida em propaganda eleitoral na internet
              (responsável e CNPJ de campanha). [CONFIRMAR COM O JURÍDICO DA CAMPANHA]
            </p>
          )}
        </div>
      </div>
    </footer>
  )
}
