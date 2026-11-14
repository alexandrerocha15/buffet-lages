# Proposal

## Why

Ajustes da revisão visual pedem uma navbar menos volumosa sem perder a composição oficial da marca e uma sombra mais perceptível, porém suave, subindo da base das fotos do carrossel.

## What Changes

- Exibir o chapéu oficial à esquerda da logomarca horizontal `assets/fotos/logo-nav.png`, formando uma composição lado a lado com pequeno espaçamento.
- Reduzir o volume da navbar e dimensionar logomarca e chapéu proporcionalmente, mantendo a composição legível e equilibrada em desktop e mobile.
- Aplicar nas fotos do carrossel uma sombra suave que sobe a partir da borda inferior, sem escurecer excessivamente as imagens.
- Manter a imagem horizontal `logo-nav` estática e sem link; tornar somente o chapéu (`logo-chapel`) um link para a Home, preservando a navegação existente.
- Preservar o chapéu ampliado do rodapé e não alterar cores, textos, navegação ou outras funcionalidades.
- Preservar os arquivos oficiais fornecidos; gerar somente os derivados responsivos necessários para apresentação.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `site/institucional`: explicita a variante horizontal da marca na navbar e a legibilidade do símbolo oficial no rodapé.

## Impact

- `scripts/generate-brand-assets.ts` e seus testes, para gerar derivados responsivos dos dois ativos oficiais.
- `src/app/app.html`, `src/app/app.css`, `src/styles.css` e testes de aplicação/Playwright para confirmar composição, proporções, navegação, altura da navbar, sombra do carrossel e apresentação responsiva.
- Ativos oficiais `assets/fotos/logo-nav.png` e `assets/fotos/logo-chapel.png`, sem alteração dos arquivos-fonte. Sem mudanças de cor, conteúdo ou funcionalidade.
