# Site — Dra. Helena Duailibe

Site institucional da deputada estadual Helena Duailibe (Republicanos — Maranhão).
React + Vite, sem framework de CSS: os tokens de cor, tipografia e espaçamento vivem
em `src/styles/tokens.css` e nada no projeto usa valor solto.

- **No ar:** https://helenaduailibe.com.br (VPS própria — ver "Hospedagem")
- **Painel da assessoria:** https://helenaduailibe.com.br/admin
- **Fontes:** Newsreader (títulos) e IBM Plex Sans (corpo), só nos pesos usados.

## Rodar e publicar

```bash
npm install
npm run dev              # desenvolvimento
npm run build            # gera dist/ + 404.html + sitemap.xml
sudo scripts/publicar.sh # build + deploy na VPS + reinício do painel
```

`publicar.sh` roda o build e sincroniza `dist/` com `/var/www/helenaduailibe`.
Ele **exclui `data/` e `img/instagram/` do `--delete`** de propósito: essas duas
pastas são escritas pelo painel da assessoria e pelo robô do Instagram, e um
deploy descuidado apagaria o clipping e as capas dos posts.

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

## Instagram: o site se atualiza sozinho

O site **não chama a API do Instagram pelo navegador** — isso exporia o token no
código-fonte. Quem lê o Instagram é um robô na VPS:

1. O timer `helena-instagram.timer` dispara de 2 em 2 horas (e 5 min após o boot).
2. Ele roda `scripts/sync-instagram.mjs`, que lê o perfil pela **Graph API do
   Facebook** (conta comercial `17841401623695064` + token do BM da campanha),
   baixa a capa de cada post para `img/instagram/` (as URLs da Meta expiram em
   horas) e grava `data/publicacoes.json` — a fonte da verdade.
3. `scripts/editorial.mjs` deriva daí os dois arquivos que o site lê:
   `data/instagram.json` (página `/campanha`) e `data/destaques.json`
   (`/destaques` e a home), já aplicando a seleção feita no painel.
4. O site lê só esses JSONs. Sem chave no navegador, sem CORS.

Publicou no Instagram? Em no máximo 2h está no site. Sem rebuild, sem deploy —
o nginx serve `/data/` com `Cache-Control: no-store`.

```bash
systemctl list-timers helena-instagram.timer   # quando roda de novo
journalctl -u helena-instagram -n 30           # o que aconteceu na última
systemctl start helena-instagram               # forçar agora
```

Se a leitura falhar, o script sai com erro **sem sobrescrever nada** — o site
continua exibindo a última sincronização boa.

## Painel da assessoria (`/admin`)

Serviço Node (`painel/servidor.mjs`, só biblioteca padrão) em 127.0.0.1:8790,
exposto pelo nginx sob o domínio. Existe para a assessoria publicar sem mexer
em código nem no GitHub:

- **Na imprensa** — adicionar, reordenar e remover matérias do clipping.
- **Instagram** — ocultar publicação que não deve aparecer no site, marcar
  destaque (sobe para o topo da home), e "buscar agora" sem esperar o robô.

Nada vai para o ar sem clicar em **Publicar no site**.

**Configuração** fica em `/etc/helena-painel/config.json` (hash da senha e
segredo de sessão) e `/etc/helena-painel/ambiente` (token da Graph API) — os
dois fora do repositório, modo 600.

```bash
systemctl status helena-painel
journalctl -u helena-painel -n 30
```

Para trocar a senha ou criar outro usuário:

```bash
node -e "
const { randomBytes, scryptSync } = require('crypto')
const salt = randomBytes(16).toString('hex')
console.log(JSON.stringify({ salt, hash: scryptSync(process.argv[1], salt, 32).toString('hex') }, null, 2))
" 'a-senha-nova'
# cole o resultado em usuarios.<nome> no config.json e: systemctl restart helena-painel
```

Proteções: sessão em cookie HttpOnly+Secure+SameSite=Strict assinado por HMAC
(12h), comparação em tempo constante, 5 tentativas de senha por IP a cada 15
min, e o servidor só aceita os campos que o site usa (link tem que ser http/s,
código de post tem que existir de verdade). `/admin` está fora do `sitemap.xml`
e barrado no `robots.txt`.

**Onde os dados moram:** `/var/www/helenaduailibe/data/` — `imprensa.json`,
`editorial.json` (`{ocultos, fixados}`), `publicacoes.json` e os dois derivados.
São arquivos JSON comuns; dá para editar à mão no servidor em caso de aperto.

### Página "A campanha nas ruas" (`/campanha`)

Vídeos e cards das peças de campanha ficam em `src/content/campanha.js`.
São duas listas — `videos` e `galeria`. Para publicar material novo:

**Card novo (foto/peça):**

1. Salve a imagem em `public/img/campanha/` — 4/5 (1000×1250 basta), JPEG.
   Para reduzir: `ffmpeg -i original.jpg -vf scale=1000:-2 -q:v 4 saida.jpg`
2. Acrescente uma entrada em `galeria`:

```js
{
  id: 'carreata-cohab',                      // único
  imagem: 'img/campanha/carreata-cohab.jpg', // caminho a partir de public/
  titulo: 'Carreata na Cohab',
  legenda: 'Uma frase sobre a ação.',
  permalink: 'https://www.instagram.com/p/XXXX/', // opcional; sem isso vai pro perfil
}
```

`destaque: true` põe o filete vermelho na peça-chave — use em uma só.

**Vídeo novo:**

1. Comprima antes de subir (o arquivo vai junto no repositório):
   `ffmpeg -i original.mp4 -vf scale=540:-2 -c:v libx264 -crf 32 -preset slow \`
   `  -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 64k -ac 1 public/video/nome.mp4`
2. Tire o cartaz: `ffmpeg -ss 5 -i public/video/nome.mp4 -frames:v 1 -q:v 3 public/img/campanha/poster-nome.jpg`
3. Acrescente em `videos`:

```js
{
  id: 'nome',
  titulo: 'Título do vídeo',
  resumo: 'Duas linhas sobre o que acontece.',
  data: '2026-08-25',
  arquivo: 'video/nome.mp4',
  poster: 'img/campanha/poster-nome.jpg',
  permalink: perfil.instagram,
}
```

O vídeo só é baixado quando a pessoa toca em **Assistir** — antes disso o
visitante carrega só o cartaz. Com um vídeo só o card fica horizontal; a partir
de dois, vira grade de colunas. Nada mais precisa ser alterado.

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
| `imprensa.js` | clipping inicial — **hoje quem manda é o painel `/admin`**; este arquivo virou só a rede de segurança de quando `data/imprensa.json` não existe |

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
- [x] ~~**Clipping de imprensa**~~: resolvido pelo painel `/admin` — a assessoria
      publica sozinha, sem GitHub e sem código.
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

## Histórico: a Action de destaques

`automacao/sync-instagram.yml` era a rotina semanal quando o site vivia no
GitHub Pages. Não está mais em uso — quem sincroniza é o timer na VPS. O arquivo
ficou no repositório só como referência caso o site volte a ser publicado por CI.
