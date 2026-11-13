# Proposal

## Why

O projeto já produz páginas estáticas pré-renderizadas, mas ainda não está preparado para servir corretamente sob o subcaminho do GitHub Pages nem possui publicação automatizada. Esta mudança estabelece uma publicação reproduzível em `https://alexandrerocha15.github.io/buffet-lages/`, mantendo as rotas, os recursos e o orçamento utilizáveis.

## What Changes

- Configurar o build de produção para o caminho base `/buffet-lages/` e garantir que recursos estáticos e navegação respeitem esse prefixo.
- Definir a saída estática pré-renderizada como artefato de publicação e verificar acesso direto, atualização e navegação nas rotas suportadas.
- Adicionar validações de build e publicação e um workflow GitHub Actions que publique a partir da branch `main`, com permissões mínimas.
- Registrar GitHub Pages como hospedagem inicial, mantendo a possibilidade de domínio próprio futuro.
- Preservar cardápios, identidade visual e funcionalidades aprovadas. Usar o número oficial de WhatsApp confirmado `5549991014293` sem tratá-lo como segredo.

## Capabilities

### New Capabilities

- `infraestrutura/publicacao-estatica`: build e publicação de páginas estáticas sob o caminho base configurado, com navegação por rotas pré-renderizadas e publicação automatizada no GitHub Pages.

### Modified Capabilities

- Nenhuma. As capacidades existentes de conteúdo, páginas institucionais, cardápios e orçamento não terão seus requisitos funcionais alterados.

## Impact

- Build Angular (`angular.json`, `src/index.html` e referências a recursos estáticos), validações existentes de configuração e artefato `dist`.
- Novo workflow em `.github/workflows/` e configuração de GitHub Pages no repositório.
- O GitHub Pages serve este repositório sob `/buffet-lages/` e não oferece fallback de servidor para rotas arbitrárias; a publicação depende dos HTMLs pré-renderizados para as rotas suportadas.
- Divergência documental: o PRD requer domínio próprio e o TDD lista Azure Static Web Apps, Cloudflare Pages, Netlify ou Vercel como opções, sem incluir GitHub Pages. A decisão aprovada torna GitHub Pages a hospedagem inicial e domínio próprio uma possibilidade futura; esta mudança não altera os documentos-base nem presume que headers, cache ou redirects do TDD possam ser configurados integralmente no Pages.
