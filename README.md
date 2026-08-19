# Site — Dra. Helena Duailibe

Site institucional da deputada estadual Helena Duailibe (Republicanos — Maranhão).
React + Vite, sem framework de CSS: os tokens de cor, tipografia e espaçamento vivem
em `src/styles/tokens.css` e nada no projeto usa valor solto.

- **Preview (aprovação):** https://marcosleonam.github.io/helena-duailibe/
- **Fontes:** Newsreader (títulos) e IBM Plex Sans (corpo), só nos pesos usados.

## Rodar e publicar

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ + 404.html + sitemap.xml
```

O deploy do preview é a pasta `dist/` publicada no branch `gh-pages`.

## Trocar para o domínio próprio (2 linhas)

1. `vite.config.js` → `const BASE = process.env.VITE_BASE ?? '/'`
   (ou rodar o build com `VITE_BASE=/ npm run build`).
2. `src/components/Seo.jsx` → `BASE_URL` para `https://SEUDOMINIO.com.br`.

Depois: `npm run build`, subir o conteúdo de `dist/` na hospedagem e conferir
`sitemap.xml` e `robots.txt`. O `404.html` é gerado automaticamente e é o que faz
`/destaques/qualquer-slug` funcionar com refresh direto.

> Hospedagem: para site de campanha, a Lei 9.504/97 (art. 57-B) exige provedor
> estabelecido no Brasil, domínio no nome da campanha e comunicação do endereço
> eletrônico à Justiça Eleitoral.

## Destaques da semana

O site **não chama a API do Instagram pelo navegador** — isso exporia o token no
código-fonte. O fluxo é:

1. A Action `.github/workflows/sync-instagram.yml` roda toda segunda às 09h
   (ou manualmente em *Actions → Run workflow*).
2. Ela executa `scripts/sync-instagram.mjs`, que busca as publicações, baixa as
   imagens para `public/img/destaques/` (as URLs da Meta expiram em horas) e grava
   `public/data/destaques.json`.
3. O site lê apenas esse JSON. Sem chave, sem CORS.

**Pré-requisitos:** conta do Instagram em modo Profissional/Criador, um app na
Meta for Developers e o token de longa duração salvo em
*Settings → Secrets and variables → Actions* como `IG_ACCESS_TOKEN`.
Se a rotina falhar, uma issue é aberta automaticamente.

### Publicar um destaque à mão (sem depender da integração)

Edite `public/data/destaques.json`. Cada item tem esta forma:

```jsonc
{
  "atualizadoEm": "2026-08-17T12:00:00Z",
  "itens": [
    {
      "id": "18034",                                  // qualquer identificador único
      "slug": "2026-08-15-audiencia-saude-materna",   // vira a URL: /destaques/<slug>
      "titulo": "Audiência pública sobre saúde materna em São Luís",
      "resumo": "Uma ou duas frases, até 180 caracteres, sem hashtag.",
      "data": "2026-08-15",                           // AAAA-MM-DD
      "semana": "2026-W33",                           // usado para agrupar
      "imagem": "/img/destaques/audiencia.jpg",       // arquivo em public/img/destaques/
      "permalink": "https://www.instagram.com/p/XXXX/",
      "tipo": "IMAGE"
    }
  ]
}
```

Se o arquivo falhar ou vier vazio, o site cai em `src/content/destaques-fallback.json`
— nunca fica com spinner eterno nem seção vazia.

## Onde mexer no texto

Todo o conteúdo editorial está em `src/content/`, separado do layout:

| Arquivo | O que controla |
|---|---|
| `perfil.js` | nome, cargo, número, redes, dados do gabinete, identificação eleitoral |
| `credenciais.js` | a faixa de três fatos da home |
| `biografia.js` | a página *Quem é* |
| `eixos.js` | os quatro eixos de atuação e suas fontes |
| `imprensa.js` | o clipping da página *Na imprensa* (só entra matéria com link real) |

## Pendências com a assessoria

Nada abaixo foi preenchido com dado inventado. Enquanto não vier a informação,
o site mostra `[CONFIRMAR]` ou omite o elemento.

- [ ] **Fotos oficiais em alta**: 1 retrato 4:5 e 3 fotos de atuação em 3:2
      (agenda, unidade de saúde, tribuna). Hoje há apenas um retrato.
- [ ] **Gabinete**: endereço na Assembleia, telefone e e-mail institucional
      (`src/content/perfil.js` → `gabinete`).
- [ ] **WhatsApp** de atendimento, se houver (deixe vazio para não exibir o botão).
- [ ] **Eixo 2** — número do PL do Cadastro Estadual de Motoristas Envolvidos em
      Crimes de Trânsito e situação atual da tramitação.
- [ ] **Eixo 3** — autoria da ferramenta eletrônica de avaliação de risco de
      violência contra a mulher aprovada na ALEMA. **Não publicar sem confirmação
      do gabinete**: as buscas associaram o tema a outros parlamentares.
- [ ] **Formulário de contato**: criar o endpoint no Formspree ou Web3Forms e
      colar em `ENDPOINT`, no topo de `src/pages/Contato.jsx`. Enquanto estiver
      vazio, o formulário valida os campos e orienta o contato por e-mail em vez
      de fingir que enviou.
- [ ] **Identificação eleitoral no rodapé**: `perfil.eleitoral.exibir = true`
      quando o jurídico da campanha confirmar o texto e o CNPJ.
- [ ] **Agenda pública**, se a assessoria quiser uma seção para isso.

## Decisões técnicas que fogem do óbvio

- **Sem `react-helmet-async`.** O React 19 iça `<title>` e `<meta>` declarados em
  componentes direto para o `<head>`. A biblioteca resolveria o mesmo problema com
  uma dependência a mais e peer dependency presa no React 18.
- **`BrowserRouter` + `404.html`**, não `HashRouter`: mantém URLs limpas e
  compartilháveis, que é o ponto de ter OG por destaque.
- **Número 10369, não 10.** O 10 é o número do partido; 10369 é o número dela na
  urna para deputada estadual, conforme o cartão do TSE.

## Como ligar a Action de destaques

O arquivo do workflow está em `automacao/sync-instagram.yml` porque o token usado
no push não tinha o escopo `workflow` do GitHub. Para ativar, escolha um caminho:

- **Pelo terminal:** `gh auth refresh -s workflow` e depois
  `mkdir -p .github/workflows && git mv automacao/sync-instagram.yml .github/workflows/`
  seguido de commit e push.
- **Pela interface do GitHub:** *Add file → Create new file*, caminho
  `.github/workflows/sync-instagram.yml`, e cole o conteúdo do arquivo.

Depois cadastre o secret `IG_ACCESS_TOKEN` em *Settings → Secrets and variables → Actions*.
