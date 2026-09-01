#!/usr/bin/env bash
# Publica o site na VPS.
#
# --delete limpa arquivo velho do build, MAS data/ e img/instagram/ ficam de
# fora: são escritos pelo painel /admin e pelo robô do Instagram. Sem esses
# excludes um deploy apagaria o clipping da assessoria e as capas dos posts.
set -euo pipefail

cd "$(dirname "$0")/.."
DESTINO=/var/www/helenaduailibe

npm run build

rsync -a --delete \
  --exclude 'data/' \
  --exclude 'img/instagram/' \
  dist/ "$DESTINO/"

chown -R www-data:www-data "$DESTINO"
systemctl restart helena-painel
echo "Publicado em https://helenaduailibe.com.br"
