# site/institucional Specification

## Purpose

Apresenta o Buffet Lages em páginas públicas com navegação clara, fotografias reais e informação honesta sobre a jornada de orçamento, inclusive antes de existir o fluxo de solicitação.

## Requirements

### Requirement: Identidade visual da navegação principal

A navbar SHALL usar vinho fechado `#56323D` como fundo, sem a barra preta atual, preservando contraste, navegação responsiva e os comportamentos acessíveis existentes.

#### Scenario: Navegação na Home em desktop ou celular
- **WHEN** uma pessoa abre a Home em qualquer viewport
- **THEN** identifica a navbar vinho e consegue usar seus links com contraste e foco visíveis

### Requirement: Carrossel institucional acessível

A Home SHALL apresentar as três fotografias reais disponíveis em `assets/fotos` num carrossel responsivo com texto sobreposto legível, indicadores retangulares discretos que permitam selecionar cada fotografia por teclado, rotação automática acessível e respeito à preferência por movimento reduzido. SHALL NOT exibir controles de seta ou botão destacado de pausar/continuar. SHALL incluir uma sombra suave na borda inferior da área fotográfica, sem escurecimento excessivo.

#### Scenario: Avanço automático e manual
- **WHEN** a pessoa visita a Home e o movimento reduzido não está habilitado
- **THEN** as fotografias alternam automaticamente e a pessoa pode selecionar diretamente cada uma pelos indicadores retangulares, inclusive com teclado

#### Scenario: Movimento reduzido ou controle assistivo
- **WHEN** a pessoa prefere movimento reduzido ou opera por teclado/toque/leitor de tela
- **THEN** não é forçada a animação automática, não encontra setas nem botão de pausa destacado, e os indicadores e eventual controle discreto de pausa têm nomes, foco e operação compreensíveis

#### Scenario: Transição entre hero e seção seguinte
- **WHEN** a pessoa visualiza a borda inferior do hero
- **THEN** percebe uma sombra suave que separa a fotografia da próxima seção sem escurecer excessivamente a imagem

### Requirement: Cards de cardápio sem associação visual enganosa

Os cards SHALL usar os títulos Italiano, Churrasco e Contemporâneo e SHALL exibir fotografias somente quando houver imagem real adequada, sem atribuir pratos ou imagens institucionais a um cardápio incorretamente.

#### Scenario: Apresentação dos cards na Home
- **WHEN** a pessoa consulta a seção de cardápios
- **THEN** encontra os três títulos simples e nenhuma fotografia ou legenda que sugira associação não confirmada

### Requirement: Página inicial institucional

A página inicial SHALL apresentar o nome do Buffet Lages, uma introdução institucional sem alegações não verificadas, acesso aos três cardápios, fotografias reais e uma explicação de como funcionará a solicitação de orçamento.

#### Scenario: Visitante encontra o conteúdo principal
- **WHEN** uma pessoa abre `/` em celular ou desktop
- **THEN** encontra identificação do buffet, acesso aos cardápios, fotografias e informação sobre orçamento sem precisar interagir com carrossel ou menu oculto por hover

### Requirement: Fotografias com uso fiel e condicionado

A apresentação SHALL utilizar as três fotografias reais como material institucional, sem atribuí-las a cardápios específicos, e SHALL NOT publicar imagens não autorizadas nem usar imagens genéricas como se fossem pratos ou eventos da empresa.

#### Scenario: Fotografias exibidas em protótipo autorizado para revisão
- **WHEN** a Home é revisada em ambiente interno com as fotografias originais disponíveis
- **THEN** as três fotografias aparecem em posições institucionais com descrições alternativas provisórias identificadas para aprovação, sem alegar relação com cardápio específico

#### Scenario: Autorização ou texto alternativo definitivo pendente
- **WHEN** faltar autorização de uso, liberação das pessoas ao fundo de `mesa-richots.png` ou aprovação dos textos/créditos necessários
- **THEN** a versão pública não é publicada com essas fotografias, mantendo-se a revisão restrita a ambiente interno até a pendência ser resolvida

### Requirement: Navegação acessível entre páginas públicas

A interface SHALL oferecer navegação responsiva para Home e os três cardápios, com rótulos compreensíveis, indicação da página atual, link de pular para o conteúdo, foco visível e operação completa por teclado e toque.

#### Scenario: Abertura e fechamento de menu em tela estreita
- **WHEN** uma pessoa navega por teclado ou toque em tela estreita
- **THEN** consegue abrir e fechar o menu, identificar seu estado e acessar cada página sem depender de hover

#### Scenario: Mudança de página
- **WHEN** uma pessoa ativa um link de navegação
- **THEN** o conteúdo e o título da página mudam, a página ativa é identificável e o foco é encaminhado ao conteúdo principal ou ao título

### Requirement: Chamada honesta para a jornada de orçamento

Enquanto o fluxo `/orcamento` não existir, as páginas SHALL orientar a pessoa sobre a futura solicitação e oferecer apenas ações funcionais de consulta aos cardápios ou de navegação à explicação; SHALL NOT apresentar link ativo de envio, reserva, formulário ou WhatsApp indisponível. Quando o fluxo `/orcamento` existir, a chamada de solicitação SHALL encaminhar para ele, sem prometer contratação ou disponibilidade automática.

#### Scenario: Pessoa busca solicitar orçamento nesta entrega
- **WHEN** a pessoa lê uma chamada sobre orçamento antes de o fluxo estar disponível
- **THEN** entende que a solicitação ainda não está disponível e pode acessar os cardápios e a explicação, sem encontrar link quebrado ou promessa de envio

#### Scenario: Fluxo posterior de orçamento disponível
- **WHEN** uma mudança disponibiliza `/orcamento` com a solicitação efetiva
- **THEN** a chamada de solicitação encaminha à rota real sem alterar os cardápios nem prometer contratação ou disponibilidade automática

### Requirement: Clareza, legibilidade e ausência de alegações não aprovadas

As páginas SHALL usar linguagem simples e legível, texto principal de pelo menos 16 px, contraste de texto de ao menos 4,5:1 e alvos interativos de pelo menos 44×44 px; SHALL NOT inventar depoimentos, contatos, serviços, cidade de atendimento ou condições comerciais.

#### Scenario: Consulta em celular por pessoa com pouca familiaridade digital
- **WHEN** uma pessoa consulta a Home em tela pequena e amplia o texto
- **THEN** os textos e controles permanecem legíveis e utilizáveis, sem rolagem horizontal do conteúdo principal

#### Scenario: Dados empresariais ausentes
- **WHEN** informações oficiais ainda não foram fornecidas
- **THEN** textos e rodapé não exibem telefone, localização, horários, depoimentos ou redes sociais fictícios
