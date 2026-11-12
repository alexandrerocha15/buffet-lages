# Design

## Context

Ver `proposal.md` para a motivação e `specs/site/*/spec.md` para o comportamento esperado. A aplicação Angular 22.2.6 já tem shell standalone, Home preliminar, fontes locais, testes de navegação e derivados AVIF/WebP gerados de três PNG originais; 7 de 16 tarefas estavam marcadas como concluídas antes desta revisão. `StaticMenuSource.loadMenus()` retorna `Promise<readonly Menu[]>` de dados gerados; o `resource` usa `id` para transferir os menus via `TransferState` e evitar deslocamento de layout na hidratação, mantendo o pipeline de fidelidade intacto. O layout atual da Home, com hero em duas colunas e aspecto de blog, não foi aprovado e deve ser substituído, sem descartar as entregas técnicas válidas. Ainda não há páginas de cardápio nem fluxo de orçamento. PRD 0.4 e TDD 0.2 condicionam a publicação a autorizações, dados oficiais e aprovação dos textos.

## Goals / Non-Goals

**Goals:**

- Revisar a direção visual reprovada: navbar vinho fechado `#56323D` (sem barra preta/grafite), hero em carrossel fotográfico com texto sobreposto legível e transições suaves, mantendo leitura confortável em celular, tablet e desktop.
- Usar as três fotografias reais de `assets/fotos` com controles acessíveis, teclado/toque e suporte a `prefers-reduced-motion`; imagens responsivas e originais preservados.
- Usar títulos simples nos cards e fotografias somente quando adequadas, sem atribuições enganosas; manter “Momentos em torno da mesa”.
- Exibir categorias e pratos em sequência vertical única e fiel aos Markdown, sem divisórias entre pratos e com linha decorativa vinho centralizada sob cada título de categoria (cerca de 20–30 px além da largura do título); navegação circular dinâmica entre cardápios, com setas desktop e gestos móveis além de controles acessíveis; retorno “Voltar aos cardápios” para `/#cardapios`.
- Refinar o carrossel com três indicadores horizontais retangulares e discretos, seleção por teclado, sem setas ou botão destacado de pausa; manter rotação automática e suporte a movimento reduzido, com pausa apenas em controle discreto/acessível quando necessário. Aplicar sombra inferior suave ao hero, sem escurecimento excessivo das fotografias.
- Tornar Home e três cardápios HTML pré-renderizado e navegável, com composição reutilizável que não acople a UI aos Markdown.
- Definir uma experiência intermediária verdadeira para os CTAs enquanto não há `/orcamento`, deixando a evolução posterior sem quebra da navegação.

**Non-Goals:**

- Criar estado de seleção, rotas `/montar` ou `/orcamento`, formulário, política de privacidade fictícia ou contato via WhatsApp.
- Liberar publicação com fotos, créditos, textos, dados locais, domínio ou número oficial ainda pendentes; integrar Instagram, QR code ou novos contatos.

## Decisions

### 1. Direção visual revisada após avaliação

Usar linguagem premium de buffet/eventos com navbar horizontal vinho fechado `#56323D`, eliminando a barra preta atual; fotografia protagonista, hierarquia e respiro, sem aparência de blog ou ornamentos gratuitos. Manter superfícies porcelana e tipografia existentes.

| Papel | Cor | Aplicação |
|---|---|---|
| Grafite | `#292A2A` | texto principal e superfícies escuras, não navbar |
| Branco porcelana | `#FAF9F6` | fundo das seções claras |
| Vinho fechado | `#56323D` | CTA e detalhes pontuais, não grandes fundos repetidos |
| Branco | `#FFFFFF` | texto sobre grafite/vinho e superfícies de cards quando necessário |

Texto grafite sobre porcelana e branco sobre grafite/vinho; não usar vinho para textos pequenos sem verificar contraste. Para o hero, posicionar texto **sobre a imagem** em painel grafite de opacidade suficiente (ou bloco opaco), testado em todos os recortes; não depender da luminosidade da foto, de sombra de texto ou de degradê para obter 4,5:1. Foco visível independente do hover, com contraste ≥ 3:1. Manter **Cormorant Garamond** nos títulos grandes e **Source Sans 3** em corpo/controles, já hospedadas localmente com `font-display: swap` e fallbacks. Corpo 16–18 px, entrelinha ~1,5, títulos fluidos e largura de leitura ~65–70 caracteres. Alternativas descartadas: hero em colunas separadas, framework de template e fontes remotas.

### 2. Composição e organização das páginas

Home: link de pular → navbar vinho horizontal; menu móvel mantém teclado/Escape/estado/foco → carrossel abaixo da navbar com as três fotografias reais, transição suave, três indicadores horizontais selecionáveis por teclado e sem setas; rotação automática respeita `prefers-reduced-motion`, e a pausa, se exposta, é discreta e acessível, não um botão destacado. Sombra suave na borda inferior do hero faz a transição para a seção seguinte sem escurecer excessivamente as fotos. Texto sobreposto em painel com contraste suficiente em todos os recortes e imagens responsivas → breve apresentação → cards com títulos Italiano, Churrasco e Contemporâneo, fotos somente se adequadas e nunca associadas a pratos/cardápios sem evidência → galeria “Momentos em torno da mesa” → seção `#como-funciona` e rodapé honesto. Não adicionar Instagram, QR code ou contatos.

Página `/cardapios/:slug`: “Voltar aos cardápios” aponta a `/#cardapios`; preservar a largura/posição atual do bloco principal e centralizar seu texto — título, categorias e nomes de pratos — numa única sequência vertical. Pratos não têm linhas divisórias; cada título de categoria recebe apenas uma linha decorativa vinho centralizada, aproximadamente 20–30 px além de suas extremidades; manter espaçamento vertical confortável e fidelidade estrita ao Markdown (grafia, conteúdo e ordem). Navegação circular calculada dinamicamente a partir dos menus disponíveis, com setas laterais no desktop, gestos horizontais no celular e controles de teclado/toque acessíveis. Gestos não são mecanismo exclusivo. O anterior do primeiro é o último e vice-versa. Sem fotos inventadas de pratos.

### 3. CTA faseado, sem rota quebrada

Nesta mudança, a linguagem usa “Como solicitar orçamento” (âncora funcional da Home) e “Conhecer cardápios”; a seção informa em linguagem simples que a solicitação pelo site será disponibilizada em outra etapa, sem prometer contato imediato. Não há botão ativo “Solicitar orçamento” que abra rota inexistente. A chamada persistente “Solicitar orçamento” exigida no PRD P-04 será ativada no shell somente na mudança que criar `/orcamento`; aqui há acesso persistente à explicação por link de navegação. Alternativa descartada: formulário-placeholder ou link de WhatsApp sem número oficial, que induziriam o visitante a erro. Esta decisão de faseamento mantém a exigência do produto final, mas não a simula nesta entrega.

### 4. Arquitetura Angular e renderização estática

Manter `App` como shell standalone/OnPush com header, `<main id="conteudo">` contendo router outlet, rodapé e link de pular. Criar `features/home/` e `features/cardapios/` lazy, `layout/` e `shared/` para apresentação; obter menus somente por `MenuSource` injetado via token/provedor apontando para `StaticMenuSource` (sem novos caminhos de acesso direto ao módulo gerado nos componentes). Resolver o slug com a fonte, renderizar estado não encontrado com `noindex` e retorno à Home, sem incorporar categoria inválida. Gerenciar foco após navegação, `aria-current`, estado `aria-expanded` do menu móvel, fechamento ao navegar/Escape, controle de scroll e preferência de movimento reduzido. Alternativa descartada: duplicar listas dos três menus no HTML.

Para garantir HTML indexável, manter `outputMode: static`, declarar as três rotas de cardápio para prerender a partir do catálogo gerado e comparar rotas vs. slugs em teste de fidelidade, conforme TDD §5; não confiar só no shell do cliente para renderizar `:slug`. Um slug desconhecido cai em visual não encontrado com `noindex`; configurar resposta HTTP 404 no host quando for escolhido, sem afirmar que fallback de hospedagem estática fornece status 404 automaticamente. Títulos e descrições únicos sem promessas não comprovadas; canonical, sitemap/robots e JSON-LD de dados oficiais seguem condicionados a `baseUrl` e dados reais, nunca usar URL fictícia em build publicável. Não antecipar JSON-LD de negócio com contatos inexistentes. Alternativa descartada: SSR em runtime, contrário ao TDD.

### 5. Imagens, publicação e testes

Preservar PNGs originais e o gerador AVIF/WebP/manifesto já implementado em `public/img/`; avaliar a composição de `mesa-frios` no hero panorâmico em desktop e em recorte vertical no celular, mantendo área segura para o texto. Se necessário, acrescentar **derivados/cortes distintos por breakpoint** a partir dos originais, com `picture`/`srcset`/`sizes`, dimensões explícitas, hero prioritário e demais imagens lazy, sem editar os PNG. Se nenhum corte permitir enquadramento adequado sem perder o assunto, sinalizar a necessidade de nova fotografia ou versão aprovada, sem usar banco de imagens nem forçar recorte ruim. Manter hero ≤ 200 KB e galeria ≤ 150 KB no tamanho exibido. Usar descrições alternativas baseadas apenas no que se vê e legendas neutras aprovadas editorialmente pelo responsável em 2026-11-12. A autorização para todas as fotografias, inclusive as pessoas em `mesa-richots`, foi confirmada pelo responsável em 2026-11-12. Alternativa descartada: servir PNGs originais ou associar fotos obrigatoriamente a cardápios específicos.

Testar Home e cardápios em 320 px, celular comum, tablet e desktop, com enquadramento e texto legível no hero, teclado/axe/leitor de tela, sem rolagem horizontal com zoom, foco/contraste/alvos de 44 px; comparar conteúdo renderizado ao `MenuSource` e verificar que não há preços, CTAs quebrados ou rota de orçamento. Testar HTML pré-renderizado sem JS, títulos/metadados, fotos otimizadas e rotas de catálogo; medir Lighthouse móvel (Performance ≥ 90, Acessibilidade ≥ 95, SEO ≥ 90; LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1), preferindo Playwright quando a suíte for adicionada. O preview anterior mediu **LCP 4,51 s** e **CLS 0,00015**: a nova composição e os cortes exigem nova medição e otimização, sem declarar a meta de LCP atendida. Manter `npm run verify:content`, `npm test`, `npm run lint` e `npm run build` funcionando.

## Risks / Trade-offs

- [Autorização e aprovações visual/editorial confirmadas pelo responsável em 2026-11-12] → preservar o portão de publicação para os dados oficiais, configuração do host e medições de campo que continuam pendentes; não publicar nesta mudança.
- [Foto atual pode não permitir hero panorâmico e recorte móvel com texto legível] → testar desktop/celular; gerar apenas cortes derivados aprováveis ou solicitar novos enquadramentos, preservando originais e sem substituir por banco de imagens.
- [LCP móvel anterior de 4,51 s acima da meta] → refazer a medição após o redesenho e otimizar hero/recursos críticos até atingir a meta antes de concluir a tarefa de integração.
- [Fotografias sem autorizações, sobretudo pessoas em `mesa-richots`] → somente protótipo interno até liberação ou tratamento aprovado; originais intocados.
- [Fonte licenciada ou pipeline de imagens aumentar complexidade] → verificar licença e orçamento real antes de adicionar arquivos; usar fallbacks locais sem bloquear leitura.
- [CTA de orçamento não é transação nesta fatia] → texto explícito e links úteis, ativação da solicitação somente quando o fluxo estiver pronto.
- [Prerender de slug desconhecido e hospedagem estática] → testar rotas conhecidas em HTML gerado; planejar 404/redirects específicos com o provedor escolhido sem publicar fallback enganoso.
- [Dados de SEO local/domínio ausentes] → não inventar metadados oficiais; validar e completar portões de publicação no trabalho posterior.

## Migration Plan

Nenhuma migração de dados: substituir apenas a composição visual preliminar da Home e da navbar, aproveitando shell, fontes e pipeline existentes; as páginas de cardápio ainda serão implementadas sobre a fonte atual. O responsável confirmou em 2026-11-12 as aprovações visual e editorial de textos/créditos e a autorização das fotografias. Manter o preview interno até completar os dados oficiais e a configuração do host requeridos pelos portões de publicação do TDD. Rollback da interface por reversão da mudança de apresentação, preservando `assets/`, pipeline e documentos aprovados.
