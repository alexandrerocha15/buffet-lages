# Design

## Context

O cabeçalho e rodapé ficam no componente compartilhado `src/app/app.html`, com regras em `src/app/app.css`. O link `.brand` aponta para `/`; a imagem horizontal usa um derivado em `public/brand/` produzido por `scripts/generate-brand-assets.ts`. A regra anterior limitava a logomarca a 2.75rem e o chapéu do rodapé a 2rem; o cabeçalho desktop tem mínimo de 5.25rem. Os arquivos oficiais `logo-nav.png` (1774×887) e `logo-chapel.png` (1441×1092) são PNGs com transparência. O chapéu já é derivado para uso no rodapé e pode ser reutilizado na navbar.

## Goals / Non-Goals

**Goals:**

- Compor os dois ativos oficiais na navbar, ampliando a logomarca sem distorção e sem alterar os arquivos-fonte.
- Preservar o chapéu ampliado do rodapé, o nome, cores e alinhamento.
- Confirmar proporção, destino do link, equilíbrio da composição e apresentação em desktop e mobile.

**Non-Goals:**

- Alterar favicon, navegação, conteúdo textual, cores, tipografia ou outras funcionalidades.
- Mudar o fluxo de publicação ou as demais mudanças OpenSpec.

## Decisions

- **Compor imagens oficiais sem editá-las.** Gerar derivados transparentes separados para `logo-nav.png` e `logo-chapel.png`, com contenção e proporções originais. Exibir o chapéu primeiro dentro de um link acessível para `/`, seguido pela imagem horizontal estática fora do link; não combinar pixels nem redesenhar os arquivos.
- **Manter a composição compacta.** Reduzir a altura mínima desktop do cabeçalho para 4.5rem, usar logomarca de até 2.75rem e chapéu de 2.25rem; em mobile, reduzir para 2.5rem e 2rem e diminuir o preenchimento vertical. Manter proporção, pequeno espaçamento e limites de largura para não empurrar o botão de menu nem criar rolagem horizontal.
- **Preservar o rodapé.** Manter a altura ampliada atual do chapéu no rodapé e validar seu alinhamento, sem alterar o texto.
- **Projetar sombra ascendente suave no carrossel.** Ajustar somente o pseudo-elemento inferior já existente em `src/styles.css`, usando gradiente `to top` com baixa opacidade e transição gradual; preservar fotos, painel sobreposto e controles.
- **Manter `logo-nav` sem estado de hover.** A imagem horizontal não é controle e não deve receber animações, transformações ou cursor de interação. O link fica restrito ao chapéu.
- **Ampliar as verificações.** Atualizar testes do gerador, componente e Playwright para conferir os dois ativos, proporções, transparência, espaço entre eles, chapéu como link para Home, imagem horizontal fora do link e apresentação nos viewports desktop/mobile.

## Risks / Trade-offs

- [A composição ficar larga demais em mobile] → limitar a largura total em função do viewport e testar sem rolagem horizontal ou colisão com o botão de menu.
- [A navbar continuar volumosa ou a marca ficar pequena demais após o ajuste] → conferir as dimensões efetivas em desktop e mobile, mantendo equilíbrio entre a composição e o cabeçalho compacto.
- [O chapéu competir visualmente com o nome] → manter proporção menor que a altura da logomarca e validar o pequeno espaçamento e equilíbrio visual.
- [A sombra reduzir a luminosidade das fotos ou competir com o texto] → limitar opacidade e extensão do gradiente, verificando contraste e legibilidade do painel sobreposto.

## Migration Plan

1. Atualizar gerador e testes para produzir derivados proporcionais das fontes oficiais e compor o chapéu com a logomarca na navbar.
2. Compactar a navbar e atualizar a sombra ascendente do carrossel, cobrindo ambos os ajustes em testes responsivos.
3. Rodar testes, lint e build; conferir referências, proporções e que somente o chapéu redireciona à Home no artefato estático.
4. Rollback: restaurar somente a fonte anterior do derivado de navegação e o tamanho CSS anterior do chapéu, sem alterar os arquivos-fonte oficiais.
