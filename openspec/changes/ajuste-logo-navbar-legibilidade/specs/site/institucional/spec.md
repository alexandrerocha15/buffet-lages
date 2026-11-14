# Spec Delta

## MODIFIED Requirements

### Requirement: Identidade visual da navegação principal

A navbar SHALL usar vinho fechado `#56323D` como fundo, sem a barra preta atual, preservando contraste, navegação responsiva e os comportamentos acessíveis existentes. A marca SHALL exibir o chapéu oficial à esquerda da imagem `assets/fotos/logo-nav.png`, com o nome Buffet Lages e os talheres, formando uma composição de ativos oficiais com transparência e proporções preservadas. A imagem horizontal `logo-nav` SHALL permanecer estática e não clicável, sem animação ou efeito visual no hover. Somente o chapéu (`logo-chapel`) SHALL ser clicável e redirecionar à Home. A composição SHALL permanecer legível e equilibrada em desktop e mobile, sem tornar a navbar excessivamente alta ou volumosa; os links existentes da navegação SHALL permanecer funcionais.

#### Scenario: Navegação na Home em desktop ou celular

- **WHEN** uma pessoa abre a Home em qualquer viewport
- **THEN** identifica a navbar vinho e consegue usar seus links com contraste e foco visíveis

#### Scenario: Composição compacta com interação somente no chapéu

- **WHEN** uma pessoa visualiza a navbar em viewport desktop ou mobile
- **THEN** vê o chapéu oficial clicável à esquerda da logomarca horizontal oficial estática e não clicável, com ativos proporcionais e sem distorção, em uma navbar compacta

#### Scenario: Retorno à Home pelo chapéu

- **WHEN** uma pessoa ativa o chapéu oficial na navbar
- **THEN** navega para a Home; a imagem horizontal `logo-nav` não age como link e não apresenta efeito no hover

## ADDED Requirements

### Requirement: Legibilidade do símbolo oficial no rodapé

O rodapé SHALL manter o símbolo isolado oficial do chapéu antes do texto “Buffet Lages” e dimensioná-lo para melhor legibilidade, alinhado verticalmente ao nome sem alterar textos ou cores.

#### Scenario: Chapéu legível junto ao nome

- **WHEN** uma pessoa consulta o rodapé em qualquer viewport
- **THEN** identifica claramente o chapéu isolado ao lado do nome “Buffet Lages”, com alinhamento equilibrado e sem mudança no restante do rodapé

## MODIFIED Requirements

### Requirement: Carrossel institucional acessível

A Home SHALL apresentar as três fotografias reais disponíveis em `assets/fotos` num carrossel responsivo com texto sobreposto legível, indicadores retangulares discretos que permitam selecionar cada fotografia por teclado, rotação automática acessível e respeito à preferência por movimento reduzido. SHALL NOT exibir controles de seta ou botão destacado de pausar/continuar. SHALL incluir uma sombra suave projetada da borda inferior para cima sobre as fotografias, sem escurecimento excessivo.

#### Scenario: Avanço automático e manual

- **WHEN** a pessoa visita a Home e o movimento reduzido não está habilitado
- **THEN** as fotografias alternam automaticamente e a pessoa pode selecionar diretamente cada uma pelos indicadores retangulares, inclusive com teclado

#### Scenario: Movimento reduzido ou controle assistivo

- **WHEN** a pessoa prefere movimento reduzido ou opera por teclado/toque/leitor de tela
- **THEN** não é forçada a animação automática, não encontra setas nem botão de pausa destacado, e os indicadores e eventual controle discreto de pausa têm nomes, foco e operação compreensíveis

#### Scenario: Sombra suave na base das fotografias

- **WHEN** uma pessoa visualiza as fotografias do carrossel no cabeçalho da Home
- **THEN** percebe uma sombra suave que sobe da borda inferior sobre as fotos, sem escurecimento excessivo nem prejuízo à leitura do conteúdo sobreposto

#### Scenario: Transição entre hero e seção seguinte

- **WHEN** a pessoa visualiza a borda inferior do hero
- **THEN** percebe uma sombra suave que separa a fotografia da próxima seção sem escurecer excessivamente a imagem
