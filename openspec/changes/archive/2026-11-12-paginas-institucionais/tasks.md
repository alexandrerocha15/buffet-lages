# Tasks

## 1. Base visual e navegação

- [x] 1.1 Substituir em `src/styles.css` os tokens da paleta rejeitada por grafite `#292A2A`, porcelana `#FAF9F6` e vinho `#56323D`, preservando tipografia e escala legível; verificar contraste de texto ≥ 4,5:1, foco ≥ 3:1 e leitura com zoom em celular.
- [x] 1.2 Obter versões de licença aberta de Cormorant Garamond e Source Sans 3, hospedar subconjuntos localmente com `font-display: swap` e fallbacks; conferir licença incluída, ausência de requisições externas de fonte e layout sem deslocamentos perceptíveis.
- [x] 1.3 Criar shell standalone/OnPush com skip link, `header/nav/main/footer` e menu móvel operável por teclado/toque, Escape, `aria-expanded`, `aria-current` e foco após troca de rota; testar navegação por teclado e o teste do `App` atualizado.
- [x] 1.4 Implementar links persistentes Início, Cardápios e “Como solicitar orçamento” levando a `/#como-funciona`, sem `/orcamento` ativo; testar que todo link resolve e que não há promessa de envio disponível.
- [x] 1.5 Revisar a navbar em `src/app/app.css` para usar vinho fechado `#56323D` em vez da faixa preta/grafite, preservando comportamentos de 1.3/1.4; verificar links, foco, contraste e layout desktop/celular. `npm test -- --watch=false`: 14 testes aprovados.

## 2. Home e fotografias

- [x] 2.1 Criar gerador de derivados AVIF/WebP e manifesto de dimensões para as três fotos de `assets/fotos/` em `public/img/`, sem alterar originais e com geração reproduzível antes do build; verificar que imagens de destaque/galeria no tamanho exibido atendem ≤ 200 KB/≤ 150 KB e que os PNG originais não entram na saída.
- [x] 2.2 Revisar `home.html`/`home.css` para manter a seção “Momentos em torno da mesa”, simplificar cards para Italiano/Churrasco/Contemporâneo e usar fotos nos cards somente quando adequadas, sem associações incorretas; validar desktop/celular, `#como-funciona` e ausência de conteúdo inventado. Testes de Home aprovados.
- [x] 2.3 Testar o enquadramento real do hero em desktop/celular; ajustar painel de contraste e `picture`/`srcset`/`sizes`, dimensões, prioridade e lazy loading, criando somente cortes derivados se necessários, sem tocar nos PNG; verificar as três fotos apenas como material institucional, orçamentos de imagem, alt/legendas provisórios e medir novamente LCP/CLS, registrando necessidade de novas fotos se nenhum corte servir.
- [x] 2.5 Implementar carrossel com as três fotos reais responsivas, transição automática suave, controles acessíveis e teclado/toque; respeitar `prefers-reduced-motion`, texto sobreposto contrastante e originais intactos. Testes de componente aprovados (16 testes no total).
- [x] 2.6 Refinar o carrossel sem setas nem pausa destacada, substituir bolinhas por três indicadores retangulares discretos e selecionáveis por teclado, preservar rotação automática/acessibilidade/movimento reduzido e adicionar sombra inferior suave ao hero; testar indicadores, foco e ausência dos controles removidos.
- [x] 2.4 Revisar com o responsável o novo preview da Home, textos, enquadramentos, créditos e status das autorizações; registrar pendências para publicação sem presumir liberação das três fotos nem das pessoas em `mesa-richots`, e não publicar externamente. Em 2026-11-12, o responsável aprovou o visual da Home e dos três cardápios, confirmou a aprovação editorial final de textos e créditos e autorizou o uso de todas as fotografias fornecidas, inclusive as pessoas visíveis em `mesa-richots`; nenhuma publicação foi realizada.

## 3. Páginas dos cardápios

- [x] 3.1 Registrar a fonte `MenuSource`/`StaticMenuSource` como dependência das páginas e carregar menus sem parsing Markdown no navegador; testar renderização após regenerar o conteúdo e ausência de import direto de dados gerados nos componentes.
- [x] 3.2 Revisar a página de cardápio para centralizar títulos, categorias e pratos, mantendo bloco/largura, coluna única, divisórias, conteúdo Markdown, navegação e responsividade; validar os três cardápios com testes, lint e build. `npm test`: 19 testes; `npm run lint`, `npm run verify:content` e `npm run build` aprovados.
- [x] 3.3 Criar navegação circular dinâmica para a quantidade disponível de cardápios, com setas desktop, gesto horizontal móvel e controles acessíveis por teclado/toque; alterar retorno para “Voltar aos cardápios” em `/#cardapios`. Preservar estado não encontrado/noindex e validar limites circulares e quantidade variável. Testes UI aprovados.
- [x] 3.4 Atualizar testes de Home e cardápios para validar títulos simples, sequência vertical e fidelidade Markdown, navegação circular e retorno à Home, sem preços ou conteúdo inventado; executar `npm run verify:content` e testes de UI. `npm run verify:content`: 18 testes; `npm test`: 19 testes aprovados.
- [x] 3.5 Remover linhas divisórias entre pratos, manter alinhamento central e espaçamento vertical agradável e estilizar uma linha vinho centralizada sob cada título de categoria, com cerca de 20–30 px além do título; validar os cardápios sem alterar conteúdo/origem Markdown.

## 4. Prerender, SEO e integração da fatia

- [x] 4.1 Gerar a lista de rotas pré-renderizadas a partir do catálogo e conectá-la ao build Angular estático; testar igualdade entre slugs e rotas e confirmar que HTML gerado para `/` e três cardápios contém conteúdo sem JavaScript.
- [x] 4.2 Adicionar títulos e descrições únicos e `noindex` para não encontrados, sem canonical/JSON-LD/URL fictícios; conferir metadados no HTML estático e manter o portão de publicação para `baseUrl` e dados oficiais pendentes.
- [x] 4.3 Executar testes de navegação responsiva a 320 px, celular, tablet e desktop, com zoom, teclado, axe e leitor de tela; verificar WCAG 2.2 AA no escopo e ausência de rolagem horizontal, com alvos ≥ 44×44 px. Lighthouse Acessibilidade executado em 2026-11-12 nos quatro viewports e nas quatro rotas: score 100, sem falhas automatizadas inclusive em contraste; `npm test -- --watch=false`: 19 testes aprovados, incluindo Escape, foco pós-rota, teclas do carrossel e gesto simulado. Em 2026-11-12, o responsável confirmou teclado na Home e nos três cardápios com foco visível, zoom/reflow a 200% e 400% nas quatro rotas sem cortes a 320 CSS px, teste em celular real via rede local (carrossel, navegação entre cardápios, rolagem vertical e layout responsivo aprovados), narração coerente do Narrador na Home e nos cardápios e axe DevTools sem violações nas quatro rotas.
- [x] 4.4 Reexecutar `npm run verify:content`, `npm test`, `npm run lint` e `npm run build` após o carrossel e a navegação circular; inspecionar HTML/imagens e medir Lighthouse móvel (90/95/90; LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1), registrando resultados e pendências sem publicar. Verificação 2026-11-12: verify:content 18 testes; UI 19 testes; lint/build aprovados; Lighthouse mobile/devtools nas quatro rotas: Performance 97–100, Acessibilidade 100, SEO 100, LCP 0,78–1,76 s, CLS ≤ 0,056, TBT 55–112 ms.
- [x] 4.5 Executar testes, lint e build após os refinamentos visuais e a correção do orçamento CSS; confirmar fidelidade dos nomes/ordem dos pratos e que as fotografias originais e Markdown de conteúdo não foram alterados. Verificação final 2026-11-12: `npm test -- --watch=false` 19 testes; `npm run verify:content` 18 testes; `npm run lint` aprovado; `npm run build` aprovado com 4 rotas e sem aviso de orçamento CSS; `openspec validate paginas-institucionais --strict --json` válido, sem issues.

## Verificação

Executado em 2026-11-12:

- `npm run verify:content`: 6 arquivos, 18 testes aprovados.
- `npm test -- --watch=false`: 3 arquivos, 14 testes aprovados.
- `npm run lint`: todos os arquivos aprovados.
- `npm run build`: concluído, 4 rotas estáticas pré-renderizadas (`/` e os três cardápios).
- HTML pré-renderizado contém o conteúdo das páginas sem JavaScript, com títulos e descrições únicos; a rota desconhecida recebe `noindex` no cliente.
- Verificação responsiva em 320, 412, 768 e 1440 px sem rolagem horizontal; alvos interativos com pelo menos 44 × 44 px.
- Hero `mesa-frios` usa `picture`/`srcset`/`sizes`, dimensões explícitas, `fetchpriority="high"` e `loading="eager"`; derivados exibidos ficam em 66,2 KB (AVIF 1200) e 83 KB (WebP 800). Galeria usa `loading="lazy"` e derivados ≤ 117,7 KB. Nenhum corte adicional foi necessário; os PNGs originais permanecem intocados.
- O componente de cardápio semeia o `resource` com os menus transferidos no HTML (`TransferState`), evitando a troca pelo estado de carregamento durante a hidratação.
- Lighthouse móvel com servidor estático local que resolve `index.html` de diretórios e comprime Brotli/gzip. O `npx serve -s` não resolve índices aninhados e servia a Home para `/cardapios/:slug`, distorcendo LCP/CLS; por isso a medição usa o servidor com índice de diretório:

| Rota | Desempenho | Acessibilidade | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|
| `/` | 100 | 100 | 100 | 1,09 s | 0,00009 | 24 ms |
| `/cardapios/italiano` | 100 | 100 | 100 | 0,65 s | 0,05809 | 12 ms |
| `/cardapios/churrasco` | 100 | 100 | 100 | 0,65 s | 0,05809 | 12 ms |
| `/cardapios/contemporaneo` | 100 | 100 | 100 | 0,65 s | 0,00009 | 14 ms |

### Pendências antes de publicar

- INP não é medido pelo Lighthouse em laboratório; o TBT de 12–24 ms é apenas proxy e o INP deve ser confirmado com dados de campo após publicação.
- Aprovação visual da Home e dos três cardápios, aprovação editorial final de textos e créditos e autorização de uso de todas as fotografias fornecidas confirmadas pelo responsável em 2026-11-12. A publicação continua sujeita aos portões técnicos e dados oficiais listados abaixo.
- A tarefa 4.3 foi concluída com verificação automatizada Lighthouse e axe DevTools (zero violações reportadas pela pessoa responsável em cada uma das quatro rotas) e confirmações manuais registradas abaixo. A auditoria automatizada não substitui a observação contínua com tecnologias assistivas.
- O host deve servir `/cardapios/{slug}/index.html` (ou redirecionar para a barra final) sem aplicar fallback de SPA que substitua páginas válidas pela Home; configurar resposta HTTP 404 para slug desconhecido, além de `baseUrl`, domínio e dados oficiais pendentes.

### Verificação após revisão visual (2026-11-12)

- `npm run verify:content`: 6 arquivos e 18 testes aprovados; `npm test -- --watch=false`: 3 arquivos e 19 testes aprovados; `npm run lint` aprovado; `npm run build` gerou as quatro rotas estáticas.
- HTML gerado da Home inclui as três fotografias; HTML de cardápio inclui categorias, links circulares e retorno `/#cardapios`, sem imagens de pratos associadas.
- Lighthouse móvel com Chrome, build estático local e throttling DevTools: `/` 97/100/100, LCP 1,76 s, CLS 0,00015, TBT 65 ms; Italiano 99/100/100, 0,79 s, 0,05599, 112 ms; Churrasco 100/100/100, 0,83 s, 0,03359, 55 ms; Contemporâneo 99/100/100, 0,78 s, 0,00024, 104 ms (Desempenho/Acessibilidade/SEO, nessa ordem). INP não é medido em laboratório.
- Aprovações visual e editorial (textos e créditos) e autorização de uso de todas as fotografias fornecidas confirmadas em 2026-11-12. Lighthouse Acessibilidade (auditorias automatizadas), executado nas rotas `/` e nos três cardápios em larguras efetivas 320, 412, 768 e 1440 px: score 100 em todos os 16 relatórios, sem auditorias automatizadas com falha, inclusive contraste. As verificações manuais de teclado, zoom/reflow, swipe em celular e leitor de tela, além da auditoria independente axe DevTools, foram concluídas e registradas na tarefa 4.3.

### Verificação após ajustes visuais (2026-11-12)

- `npm test -- --watch=false`: 3 arquivos e 19 testes aprovados; inclui ausência de setas, três indicadores selecionáveis e fidelidade de nomes/ordem dos cardápios, sem linhas divisórias entre pratos.
- `npm run verify:content`: 6 arquivos e 18 testes aprovados; geradores de menus, rotas e imagens concluídos.
- `npm run lint`: aprovado.
- `npm run build`: aprovado; 4 rotas pré-renderizadas. O Angular reportou aviso de orçamento: `home.css` ficou em 4,71 kB, 707 bytes acima do limite de 4,00 kB; não impediu o build.
- Os testes comparam os nomes e a ordem apresentados à fonte tipada. Nenhum Markdown original de conteúdo de cardápio ou fotografia original foi editado.
- A pausa do carrossel permanece como controle não destacado, revelado ao foco de teclado; movimento reduzido continua desabilitando a rotação automática. A sombra inferior é de baixa opacidade.

### Correção do orçamento CSS (2026-11-12)

- As regras exclusivas do carrossel foram movidas de `home.css` para `src/styles.css`, mantendo seletores e declarações. `npm run build` concluiu com quatro rotas pré-renderizadas e sem aviso de orçamento de `home.css`; o chunk de Home ficou em 13,41 kB e o CSS global em 3,68 kB.
- axe DevTools no Chrome: 0 problemas na Home, Italiano, Churrasco e Contemporâneo (resultado informado pelo responsável em 2026-11-12).
- Validação final em 2026-11-12: testes UI 19/19; verificação de conteúdo 18/18; lint aprovado; build aprovado com 4 rotas pré-renderizadas e sem aviso de orçamento CSS; `openspec validate paginas-institucionais --strict --json` passou (1 item, 0 issues). Os testes de conteúdo confirmam fidelidade de nomes e ordem; fontes editoriais originais e fotografias não foram alteradas.
