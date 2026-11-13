# Tasks

## 1. Estado e domínio do orçamento

- [x] 1.1 Definir tipos e store em memória para origem do cardápio, pratos selecionados, pedidos especiais, dados do evento e etapa; verificar com testes unitários transições e preservação ao avançar/voltar.
- [x] 1.2 Integrar a seleção a `MenuSource` e inicializar a opção de cardápio pronto com todos os itens do Markdown; verificar por testes de fidelidade que nomes, categorias e ordem vêm dos dados gerados sem alterar originais.
- [x] 1.3 Implementar adição/remoção por categoria e pedidos especiais: Enter adiciona à lista visual, com edição e remoção; verificar por testes unitários que se avança com ao menos um prato de catálogo OU pedido especial válido (não vazio após trim), e que a seleção vazia bloqueia.

## 2. Entrada, seleção e prévia

- [x] 2.1 Reorganizar as ações dos cardápios em uma seção própria, centralizada e visualmente coesa, com os CTAs “Solicitar orçamento deste cardápio” e “Montar meu próprio cardápio”; verificar entrada e origem em E2E.
- [x] 2.2 Implementar seleção contextual inicialmente limitada ao cardápio de origem, com itens pré-selecionados, e expansão explícita ao catálogo completo; montagem própria inicia com catálogo completo. Organizar categorias reais em abas acessíveis, preservar seleções entre abas e manter controles de adicionar/remover; verificar modo, categorias e estado em E2E. Preservar a prévia aprovada.
- [x] 2.4 Aplicar a paleta aprovada bordô/porcelana/grafite a todos os controles do fluxo; estilizar abas com texto e linha inferior bordô ativa, e validar hover/focus/active e contraste em E2E.
- [x] 2.5 Compactar pedidos especiais em linhas editáveis inline com ação × acessível; preservar inclusão por Enter/botão e estado, verificando edição, remoção e teclado.
- [x] 2.6 Alinhar prévia e cardápio na revisão ao padrão editorial centralizado, manter ordem e seção especial e adicionar transições de 200–300 ms com suporte a movimento reduzido; validar visual, ordem e acessibilidade em E2E.
- [x] 2.3 Implementar retorno da prévia à edição preservando seleção e pedidos especiais; verificar a ida e volta em teste de jornada.

## 3. Formulário e validação

- [x] 3.1 Reorganizar dados do evento em grupos compactos e intuitivos, com campos condicionais para estados de data e local, preservando campos, validações e estado; verificar estados e responsividade em E2E.
- [x] 3.2 Implementar validação acessível sem perda dos valores preenchidos; verificar erros de nome, convidados, data e cidade com testes de componente e jornada.
- [x] 3.3 Implementar revisão completa editável antes do WhatsApp; verificar dados, itens individuais, pedidos especiais e observações em linhas/seções distintas por teste de jornada.
- [x] 3.4 Substituir o seletor nativo de data definida por date picker Angular leve localizado em pt-BR, bordô, acessível por teclado e mobile, bloqueando datas passadas; preservar os três estados e validar seleção/limites em testes unitários e E2E.

## 4. Mensagem e encaminhamento WhatsApp

- [x] 4.1 Implementar composição pura da mensagem e URL `wa.me` com codificação, origem e dados do evento; verificar cenários de origem, data e local, acentos e quebras de linha em testes unitários.
- [x] 4.2 Implementar confirmação explícita antes de abrir WhatsApp e fallback de mensagem longa para copiar resumo/abrir sem texto; verificar que não ocorre navegação sem confirmação e testar o limite configurado.
- [x] 4.3 Configurar número por ambiente sem hardcode em componente e impedir build de produção com placeholder; verificar o portão com configuração ausente e válida, sem usar número fictício publicado.
- [x] 4.4 Ocultar da revisão a mensagem técnica mantendo sua composição completa em memória; usar o número oficial `5549991014293` somente na configuração de ambiente e ajustar o CTA para “Enviar solicitação pelo WhatsApp”. Validar URL/número, confirmação e fallback sem expor a mensagem técnica em E2E; executar build de produção.

## 5. Acessibilidade e integração

- [x] 5.1 Garantir rótulos, foco, anúncios de etapa, teclado, abas acessíveis e layouts móveis no fluxo atualizado; verificar axe e jornada em viewport móvel e desktop.
- [x] 5.2 Verificar privacidade e fronteiras: ausência de backend, chamadas HTTP próprias e armazenamento persistente de dados do orçamento; documentar resultado e validar a jornada completa em E2E.
- [ ] 5.3 Validar manualmente abertura e mensagem do WhatsApp em Android, iOS e desktop, inclusive fallback de texto longo; registrar limitações e resultado antes da publicação.

**Resultado da validação manual e automatizada relacionada à tarefa 5.3:** a pessoa responsável confirmou manualmente que o encaminhamento abriu o destinatário correto e apresentou a mensagem preenchida. A plataforma usada não foi informada e, portanto, não é atribuída a Android, iOS nem desktop. A suíte E2E também verificou URL/número, composição e fallback. A tarefa permanece pendente até haver evidência individual de Android, iOS e desktop.
