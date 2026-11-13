# Publicação no GitHub Pages

## Destino inicial

O destino aprovado é `https://alexandrerocha15.github.io/buffet-lages/`. O build de produção usa o caminho base `/buffet-lages/`; os assets e as páginas pré-renderizadas devem permanecer nesse prefixo. O domínio próprio poderá ser avaliado futuramente, com ajuste da base do build.

## Pré-requisito único do repositório

Antes da primeira publicação, em **Settings → Pages**, selecionar **GitHub Actions** como fonte de build e deploy. O workflow `.github/workflows/deploy-pages.yml` valida pull requests sem publicar e só executa o job de deploy após push à branch `main` bem-sucedido em todas as verificações.

O workflow requer `contents: read` para validar/buildar; o job de publicação recebe apenas `pages: write` e `id-token: write`. O artefato publicado é `dist/buffet-lages/browser`.

## Validação e limitações

O build verifica a existência dos HTMLs pré-renderizados para Home, cardápios disponíveis, `/montar` e `/orcamento`, a base href e os recursos locais usados por essas páginas. Rotas que não tenham HTML pré-renderizado podem retornar 404: GitHub Pages não oferece fallback de servidor para a aplicação Angular.

GitHub Pages não configura integralmente headers HTTP, cache avançado ou redirects previstos no TDD para outros provedores. A hospedagem inicial é uma decisão aprovada que diverge do requisito de domínio próprio do PRD e das opções de hospedagem inicialmente listadas no TDD; esses documentos não são alterados por esta configuração.

O número oficial de WhatsApp `5549991014293` é entregue ao navegador e, portanto, público. Não é credencial e não deve ser tratado como segredo do GitHub Actions.

## Verificação após a primeira publicação

Após habilitar Pages e integrar a configuração em `main`, verificar no endereço publicado a Home, cada cardápio, `/montar` e `/orcamento`, tanto por navegação interna quanto por acesso direto e atualização. Confirmar carregamento de imagens, fontes, favicon e bundles, além do destino WhatsApp. Essa verificação é posterior ao deploy e não é substituída pelos testes locais do artefato.
