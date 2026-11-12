# Proposal

## Why

O projeto já dispõe de páginas públicas, conteúdo estruturado, imagens responsivas e testes, mas a avaliação do site funcionando não aprovou o visual atual e identificou ajustes de navegação e apresentação. Esta revisão mantém as entregas técnicas válidas e atualiza o contrato visual e funcional antes de qualquer nova implementação.

## What Changes

- Revisar a Home com navbar vinho fechado `#56323D`, carrossel das três fotografias reais responsivo e acessível, títulos simples nos cards e apresentação fotográfica sem associações incorretas entre imagens e cardápios; manter “Momentos em torno da mesa”.
- Revisar as páginas dos cardápios para centralizar títulos, categorias e pratos dentro do bloco principal, mantendo sequência vertical fiel aos Markdown, sem divisórias entre pratos e com um único traço decorativo vinho sob cada categoria, além da largura e navegação circular responsiva.
- Refinar o carrossel da Home sem setas ou botão de pausa destacado, com indicadores retangulares discretos selecionáveis por teclado, rotação automática acessível e transição fotográfica inferior suave.
- Atualizar o retorno das páginas de cardápio para “Voltar aos cardápios”, direcionado à seção de cardápios da Home.
- Criar navegação compartilhada acessível, com orientação clara para localizar os cardápios e o processo de orçamento; nesta entrega, nenhuma chamada encaminha para rota de orçamento inexistente ou para WhatsApp. A ação persistente de solicitação efetiva fica condicionada à implementação posterior de `/orcamento`.
- Preservar originais, implementações, testes e funcionalidades válidas; manter os bloqueios de publicação de imagens e textos.
- Deixar integração com Instagram, QR code e novos contatos para outra etapa.
- Não incluir formulário completo, escolha/personalização de pratos, WhatsApp, backend ou recursos da Etapa 2.

## Capabilities

### New Capabilities

- `site/institucional`: Home, identidade de apresentação, navegação pública e acesso honesto à jornada futura de orçamento; requisitos revisados para navbar, carrossel e cards.
- `site/cardapios`: Páginas públicas dos cardápios, leitura estruturada e apresentação fiel do conteúdo já produzido; requisitos revisados para sequência vertical, navegação circular e retorno à Home.

### Modified Capabilities

Nenhuma. `conteudo/cardapios` já rege geração e fidelidade dos dados; esta mudança os consome sem alterar os requisitos do pipeline.

## Impact

- Interface Angular em `src/app/app.*`, `src/app/app.routes.ts`, `src/styles.css` e novos componentes de `layout/`, `shared/`, `features/home/` e `features/cardapios/`.
- Consumo de `src/app/core/content/menu-source.ts`/`static-menu-source.ts`; derivados otimizados das fotografias de `assets/fotos/` em `public/img/`, sem editar PNGs ou Markdown originais.
- Configuração de prerender e testes das rotas públicas, acessibilidade, fidelidade visual do conteúdo e desempenho; metadados públicos sem dados empresariais não confirmados. Publicação fica bloqueada até autorizações, conteúdo final e dados oficiais exigidos pelo PRD/TDD.
