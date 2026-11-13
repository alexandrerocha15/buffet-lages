# Design

## Context

O projeto já é Angular standalone e possui `MenuSource`/`StaticMenuSource`, modelos tipados gerados pelo pipeline de cardápios e rotas para Home e páginas `/cardapios/:slug`. Ainda não há rotas nem estado de orçamento. O PRD/TDD determinam estado em memória, fluxo sem backend, cardápios editoriais imutáveis, datas em três estados, local em dois estados e WhatsApp via `wa.me` com número configurado por ambiente.

## Goals / Non-Goals

**Goals:**
- Integrar as entradas por cardápio à jornada proposta, preservando origem (pronto, personalizado ou montado) e seleção ao avançar/voltar.
- Separar pratos de catálogo, pedidos especiais e observações gerais no estado e na mensagem.
- Tornar verificáveis as regras do PRD/TDD para validação, privacidade, acessibilidade e WhatsApp.

**Non-Goals:**
- Alterar parser, Markdown editorial ou modelos gerados de conteúdo sem necessidade demonstrada.
- Persistir dados, transmitir dados a serviço próprio, calcular preço ou implementar API/CRM.
- Enviar mensagem automaticamente ou afirmar reserva, disponibilidade ou contratação.

## Decisions

1. **Usar a fronteira tipada de conteúdo existente.** A feature consome `MenuSource` e os cardápios gerados no build; as listas completas continuam intactas nos dados de origem. Alternativa rejeitada: duplicar pratos na interface ou editar os Markdown para pedidos específicos, pois isso causa divergência editorial.

2. **Manter um estado de orçamento em memória, compartilhado entre etapas.** Um store Angular no escopo da aplicação mantém modo/origem, itens selecionados, pedidos especiais, dados do evento e etapa atual. A navegação entre seleção/prévia e `/orcamento` reutiliza esse estado; não incluir dados pessoais ou itens selecionados em query params ou storage. Ao iniciar por um cardápio, carregar no store todos os itens daquele menu; montagem própria inicia sem seleção. Alternativa rejeitada: `localStorage`/`sessionStorage`, proibidos pelo PRD/TDD.

3. **Representar pedidos especiais separadamente dos pratos.** Tratar cada pedido digitado como entrada própria: Enter adiciona à lista visual, e a pessoa pode editar ou remover. Manter categorias de catálogo independentes e observações gerais separadas. Para prosseguir, exigir ao menos um prato de catálogo **ou** um pedido especial válido (texto não vazio após trim). Essa regra amplia o critério do PRD P-03 e TDD §7.1, que exigem “pelo menos 1 item”/“mínimo 1 item” sem definir pedidos especiais como alternativa; a mudança registra essa divergência para permitir solicitações inteiramente personalizadas. Alternativa rejeitada: obrigar prato de catálogo mesmo havendo pedido especial válido, pois bloquearia esse caso de uso.

4. **Fluxo de apresentação: seleção → prévia confirmável → dados → revisão.** A prévia aprovada mantém tipografia, estrutura vertical, agrupamento por categorias e exibição apenas da seleção e pedidos especiais; não será redesenhada nesta revisão. Nas páginas de cardápio, os dois caminhos de entrada ficam em seção própria, centralizada, com hierarquia visual e acabamento consistente com os CTAs do site. Na seleção iniciada por um cardápio, o estado começa no modo contextual: só o cardápio de origem aparece, com todos os seus itens selecionados. Uma ação explícita permite ampliar para o catálogo completo para personalização; a montagem própria começa diretamente no catálogo completo. Os grupos/categorias viram abas acessíveis, derivadas da ordem e dos nomes reais no `MenuSource`, com seleção aditiva/removível preservada entre abas. O formulário de dados mantém os mesmos campos e validações, mas usa grupos compactos e revela somente os campos pertinentes aos estados escolhidos de data e local. O fluxo permanece em memória na jornada existente.

5. **Compor mensagem como regra pura e abrir por ação explícita.** Uma função de domínio formata seções de identificação, convidados, data, local, origem, cada prato em linha própria, pedidos especiais e observações. Gerar URL `wa.me` com codificação de URI para o número oficial confirmado pela empresa, configurado somente por ambiente; nenhum componente contém o número. A revisão não exibe a mensagem técnica, mas a mantém internamente para o botão de abertura e o cálculo do limite. Para mensagem longa, oferecer cópia do resumo e abertura sem texto, sem renderizar a mensagem técnica na tela. Somente a ação final explícita abre o WhatsApp. Alternativa rejeitada: WhatsApp Business API ou envio direto, fora do MVP.

6. **Configuração e portão de publicação.** O número oficial informado pela empresa, `5549991014293`, permanece configuração de ambiente, nunca dado no componente. Placeholder pode permitir desenvolvimento/testes, mas o build de produção deve falhar se ele permanecer, conforme TDD. O número informado habilita a configuração, mas não substitui validação manual do WhatsApp em dispositivos reais.

7. **Conservar acessibilidade e identidade aprovadas.** Reutilizar tokens, componentes e padrões visuais existentes; usar rótulos persistentes, grupos semânticos, foco visível, erros associados, alvos de toque e anúncios de mudança de etapa. Sem dependência de hover, arrastar e soltar ou padrões visuais que contrariem os cardápios institucionais.

8. **Preservar contexto sem reduzir o catálogo.** A seleção contextual inicial não remove pratos de outros cardápios: ela apenas adia a apresentação do catálogo completo até a escolha explícita de personalizar. As abas sempre refletem as categorias reais dos itens disponíveis no modo atual; não são inventadas categorias nem alterados os Markdown.

9. **Usar a identidade cromática aprovada nos controles.** O fluxo reutiliza `--wine` (#56323D), `--porcelain` (#FAF9F6), `--graphite` (#292A2A), `--white` e `--line` do tema global; não introduz tons verdes ou acentos fora da paleta. O botão principal permanece bordô com texto branco e hover levemente mais escuro. Abas são rótulos de navegação sem aparência de botões, com texto bordô e linha inferior bordô quando ativas. Hover, foco e active mantêm contraste, legibilidade e foco visível tanto na aba ativa quanto nas inativas; demais botões e campos seguem a mesma identidade.

10. **Refinar pedidos especiais sem alterar o domínio.** Manter a coleção de strings e as operações do store; apresentar cada pedido em linha compacta. Ativar o texto do item alterna para edição inline, com botão de edição acessível como alternativa ao clique, e um controle × nomeado remove o pedido. A inclusão continua pelo Enter ou botão Adicionar.

11. **Alinhar prévia e revisão ao estilo editorial.** Reutilizar hierarquia tipográfica e agrupamento centralizado dos cardápios institucionais, com detalhe bordô sob cada título de categoria. Exibir itens na ordem do store e pedidos especiais em seção própria; a revisão mostra o cardápio nesse padrão e separa os dados legíveis do evento, sem apresentar a mensagem técnica. A mensagem completa segue interna para WhatsApp e fallback. Entradas em prévia e revisão usam transição curta de opacidade e deslocamento, desativada por `prefers-reduced-motion`.

12. **Usar date picker Angular existente em vez de calendário próprio.** Para data definida, adotar o datepicker do `@ng-bootstrap/ng-bootstrap` 21, compatível com Angular 22, sem folhas Bootstrap adicionais; localizar nomes de meses/dias e navegação em pt-BR, bloquear datas anteriores e aplicar a identidade visual do tema. A avaliação de build apontou chunks lazy brutos de aproximadamente 490 kB para ng-bootstrap, 889 kB para ngx-bootstrap e 1,16 MB para Angular Material no fluxo; foi escolhida a opção menor entre as bibliotecas Angular avaliadas. Preservar mês/ano aproximado e estado sem data. Confirmar acessibilidade, operação por teclado, comportamento móvel e bundle; não implementar calendário próprio.

## Risks / Trade-offs

- [A navegação/recarregamento pode perder dados] → Aviso visível e confirmação nativa antes de sair quando houver dados, mantendo a regra de não persistência.
- [Uma mensagem longa pode exceder o limite do WhatsApp] → Limite configurável validado em teste manual e fallback de cópia/abertura sem texto.
- [O TDD especifica etapas de seleção dentro de `/orcamento`, enquanto prevê `/montar` como entrada de seleção] → Planejar etapas funcionais com estado compartilhado; validar URLs e pontos de entrada sem mover dados para query string.
- [Exibir o catálogo inteiro de imediato pode confundir o contexto do cardápio escolhido] → Iniciar restrito ao menu de origem e oferecer expansão explícita para o catálogo integral; testar ambos os modos e a seleção persistente entre abas.
- [PRD P-03 e TDD §7.1 não esclarecem se pedido especial conta para o mínimo de seleção] → Esta mudança adota explicitamente prato de catálogo OU pedido especial válido; atualizar PRD/TDD permanece fora do escopo e requer decisão documental separada.
- [Número oficial e conteúdo legal/privacidade estão pendentes] → Não inventar dados; manter configuração não publicável com placeholder e respeitar portões de publicação do TDD.

## Migration Plan

Não há migração de dados ou backend. A entrega deverá adicionar o fluxo ao frontend e seus testes; habilitar a configuração de produção somente após confirmação do número oficial. Rollback consiste em reverter a versão frontend e restaurar chamadas institucionais informativas, sem impacto em dados persistidos.

## Open Questions

- Confirmar com a empresa o número oficial e se ele pode ser exibido publicamente antes da publicação.
- Validar manualmente o limite de URL do WhatsApp em Android, iOS e desktop, como já exige o TDD.
