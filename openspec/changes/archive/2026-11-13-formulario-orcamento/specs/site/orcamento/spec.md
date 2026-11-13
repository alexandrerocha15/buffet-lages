# Spec Delta

## Purpose

Permite que visitantes componham ou escolham um cardápio, informem os dados essenciais do evento e encaminhem uma solicitação clara de orçamento ao Buffet Lages pelo WhatsApp, sem persistência ou contratação automática.

## ADDED Requirements

### Requirement: Entradas de orçamento a partir dos cardápios

O site SHALL oferecer, abaixo de cada cardápio apresentado, as ações “Solicitar orçamento deste cardápio” e “Montar meu próprio cardápio”.

#### Scenario: Iniciar com cardápio existente
- **WHEN** a pessoa ativa “Solicitar orçamento deste cardápio”
- **THEN** o fluxo abre em modo contextual, apresenta somente o cardápio de origem e inicia com todos os seus itens selecionados
- **AND** apresenta suas categorias em abas acessíveis, preservando a ordem editorial e permitindo adicionar/remover itens
- **AND** oferece uma ação explícita para expandir a seleção ao catálogo completo e personalizar com pratos de outros cardápios

#### Scenario: Iniciar montagem própria
- **WHEN** a pessoa ativa “Montar meu próprio cardápio”
- **THEN** o fluxo abre diretamente com o catálogo completo, agrupado por categorias reais em abas acessíveis, sem selecionar previamente um cardápio completo

### Requirement: Seleção de pratos por categoria

O fluxo SHALL apresentar pratos e categorias derivados dos dados tipados dos Markdown e permitir adicionar e remover pratos sem alterar os cardápios editoriais.

O fluxo SHALL apresentar uma categoria por aba, com controles de teclado e indicação programática da aba/painel ativos. Alternar categorias SHALL preservar os itens selecionados. O modo contextual SHALL limitar a apresentação inicial ao cardápio de origem; o modo de montagem SHALL disponibilizar todo o catálogo.

#### Scenario: Ajustar pratos selecionados
- **WHEN** a pessoa usa os controles de adicionar (+) ou remover (−) em um prato
- **THEN** a seleção é atualizada visualmente na categoria correspondente e os dados editoriais permanecem inalterados

#### Scenario: Avançar sem prato de catálogo
- **WHEN** a pessoa tenta avançar sem pratos de catálogo selecionados, mas tem ao menos um pedido especial não vazio após remoção de espaços nas extremidades
- **THEN** o fluxo permite avançar para a prévia do cardápio

#### Scenario: Impedir avanço sem itens válidos
- **WHEN** a pessoa tenta avançar sem pratos de catálogo e sem pedidos especiais válidos
- **THEN** o fluxo impede o avanço e explica que é necessário adicionar ao menos um prato ou pedido especial

### Requirement: Pedidos especiais editáveis

O fluxo SHALL permitir que a pessoa digite um pedido especial e pressione Enter para adicioná-lo à lista visual, onde poderá editá-lo ou removê-lo; pedidos especiais SHALL permanecer separados dos pratos editoriais e das observações gerais.

#### Scenario: Adicionar pedido especial
- **WHEN** a pessoa digita um pedido especial e pressiona Enter
- **THEN** o texto é adicionado à lista visual de pedidos especiais sem ser gravado nos Markdown

#### Scenario: Editar ou remover pedido especial
- **WHEN** a pessoa escolhe editar ou remover um pedido especial listado
- **THEN** o pedido é atualizado ou removido antes da confirmação do cardápio
- **AND** a lista usa linhas compactas; ativar o texto ou o controle de edição permite editar inline e o controle de remoção apresenta ícone × com nome acessível

### Requirement: Prévia e confirmação do cardápio

O fluxo SHALL apresentar uma prévia somente dos itens escolhidos, organizados por categoria, antes dos dados do evento e permitir confirmar ou voltar à edição.

#### Scenario: Revisar cardápio montado
- **WHEN** a pessoa conclui a etapa de seleção
- **THEN** vê categorias e pratos centralizados, na ordem selecionada, com tipografia institucional e detalhe bordô sob os títulos; pedidos especiais aparecem em seção própria integrada
- **AND** a entrada usa transição suave de opacidade e deslocamento vertical, respeitando `prefers-reduced-motion`

#### Scenario: Voltar e editar sem perda
- **WHEN** a pessoa volta da prévia para a seleção
- **THEN** os pratos e pedidos especiais previamente selecionados continuam disponíveis para edição

#### Scenario: Confirmar cardápio
- **WHEN** a pessoa confirma explicitamente a prévia
- **THEN** o fluxo mantém a composição confirmada e permite continuar aos dados do evento

### Requirement: Dados obrigatórios e opcionais do evento

O formulário SHALL coletar nome e quantidade aproximada de convidados obrigatórios, data e local nos estados definidos pelo PRD, e observações gerais opcionais separadas dos pedidos especiais.

#### Scenario: Informar dados válidos
- **WHEN** a pessoa informa nome, quantidade inteira positiva, estado válido de data e estado válido de local
- **THEN** pode continuar à revisão mantendo pedidos especiais e observações em campos distintos

#### Scenario: Data definida, aproximada ou desconhecida
- **WHEN** a pessoa escolhe uma das três opções de data
- **THEN** a data definida usa date picker acessível em português brasileiro, com destaque bordô, navegação clara entre meses e datas anteriores à atual desabilitadas; a data aproximada solicita somente mês/ano e “ainda não sei” nenhum valor
- **AND** o date picker pode ser operado por teclado e funciona em dispositivos móveis

#### Scenario: Local definido ou desconhecido
- **WHEN** a pessoa escolhe “Local definido”
- **THEN** informa cidade obrigatória e pode informar nome do espaço ou endereço; quando escolhe “Ainda não sei”, nenhum dado de local é exigido

#### Scenario: Campo obrigatório inválido
- **WHEN** nome ou quantidade de convidados está ausente ou inválido, ou a cidade está ausente para local definido
- **THEN** o fluxo informa o erro em linguagem clara e preserva seleção, pedidos especiais e demais dados já preenchidos

### Requirement: Apresentação compacta dos dados do evento

O formulário SHALL agrupar campos relacionados em uma composição compacta e intuitiva, sem alterar campos, regras de validação ou estado em memória.

#### Scenario: Campos condicionais de data e local
- **WHEN** a pessoa escolhe um estado de data ou local
- **THEN** aparecem somente os campos aplicáveis à escolha: dia/mês/ano, mês/ano ou nenhum campo de data; cidade e detalhes opcionais apenas para local definido
- **AND** os valores válidos permanecem preservados ao alternar etapas

### Requirement: Revisão completa da solicitação

O fluxo SHALL apresentar uma revisão da solicitação com dados do evento, cardápio, itens por categoria, pedidos especiais e observações antes de oferecer a abertura do WhatsApp.

#### Scenario: Conferir solicitação
- **WHEN** a pessoa chega à etapa de revisão
- **THEN** o cardápio aparece centralizado no mesmo estilo editorial da prévia, com pedidos especiais em seção própria
- **AND** os dados do evento aparecem em resumo legível com ações para editar os dados ou o cardápio
- **AND** a mensagem técnica completa não é exibida na interface e permanece disponível internamente para a ação de WhatsApp
- **AND** a entrada usa transição suave de opacidade e deslocamento vertical, respeitando `prefers-reduced-motion`

### Requirement: Abertura consciente do WhatsApp

O fluxo SHALL preparar uma mensagem organizada e SHALL abrir o WhatsApp somente após confirmação explícita da pessoa na revisão.

#### Scenario: Confirmar abertura do WhatsApp
- **WHEN** a pessoa confirma que deseja abrir o WhatsApp
- **THEN** o navegador abre conversa com o número oficial configurado e mensagem pré-preenchida contendo dados do evento, pratos por categoria, pedidos especiais e observações
- **AND** o botão final é identificado como “Enviar solicitação pelo WhatsApp”
- **AND** informa que o envio ainda depende de confirmação no aplicativo

#### Scenario: Não confirmar abertura
- **WHEN** a pessoa não confirma a abertura do WhatsApp
- **THEN** nenhuma navegação para WhatsApp ou envio de mensagem ocorre

#### Scenario: URL de mensagem longa
- **WHEN** a mensagem excede o limite prático configurado
- **THEN** o fluxo oferece copiar o resumo e abrir o WhatsApp sem texto, sem exibir permanentemente a mensagem técnica e sem descartar os dados mantidos em memória

#### Scenario: Natureza da solicitação
- **WHEN** a pessoa revisa ou abre a mensagem
- **THEN** recebe aviso de que a solicitação não é reserva nem contratação e de que disponibilidade e valor serão avaliados pelo buffet

### Requirement: Número de WhatsApp configurável

O número de destino SHALL ser configurável por ambiente e SHALL NOT ser inventado, incluído como dado fictício publicado ou hardcoded em componente visual.

#### Scenario: Número oficial ausente
- **WHEN** o ambiente de produção não possui número oficial configurado
- **THEN** a validação de publicação falha e nenhum número fictício é usado

#### Scenario: Número oficial confirmado
- **WHEN** a empresa informa o número oficial `(49) 99101-4293`
- **THEN** o ambiente usa o formato internacional `5549991014293` e os componentes continuam sem hardcode desse número

### Requirement: Estado privado em memória

O fluxo SHALL manter seleção e dados do formulário somente em memória, sem backend, banco de dados ou persistência de dados pessoais no navegador.

#### Scenario: Navegar entre etapas
- **WHEN** a pessoa avança ou retorna entre seleção, prévia, formulário e revisão
- **THEN** os dados permanecem disponíveis durante a sessão atual

#### Scenario: Atualizar ou fechar a página
- **WHEN** há dados do fluxo e a pessoa tenta atualizar ou fechar a página
- **THEN** o fluxo avisa que os dados serão perdidos e não grava os dados em armazenamento persistente

### Requirement: Acessibilidade e responsividade do fluxo

O fluxo SHALL ser utilizável em celular e desktop, por teclado e tecnologias assistivas, com rótulos, foco, erros e estados de seleção compreensíveis e sem dependência de hover.

#### Scenario: Navegar por teclado
- **WHEN** a pessoa percorre e opera o fluxo somente por teclado
- **THEN** consegue selecionar pratos, editar pedidos especiais, revisar, retornar e confirmar ações com foco visível e anúncios acessíveis das mudanças de etapa

#### Scenario: Usar em tela estreita
- **WHEN** a pessoa usa o fluxo em viewport móvel
- **THEN** conteúdo e controles permanecem legíveis e operáveis sem rolagem horizontal da página

### Requirement: Identidade visual dos controles do orçamento

Os controles do fluxo SHALL reutilizar a paleta aprovada do tema global — vinho, porcelana e grafite — sem tons esverdeados ou acentos fora dela. Os estados hover, focus e active SHALL manter contraste e legibilidade.

#### Scenario: Identificar a categoria ativa
- **WHEN** a pessoa navega pelas abas de categoria
- **THEN** a aba ativa é destacada por texto e linha inferior bordô, sem aparência de botão tradicional, e todas as abas permanecem legíveis ao hover, foco e active

#### Scenario: Acionar a ação principal
- **WHEN** a pessoa interage com “Pré-visualizar cardápio”
- **THEN** o botão permanece bordô com texto branco e usa um hover ligeiramente mais escuro, mantendo contraste e foco visível
