# Spec Delta

## Purpose

Permite conhecer cada cardápio real em uma página pública dedicada, preservando o conteúdo editorial e oferecendo uma leitura clara sem antecipar o fluxo de escolha ou contratação.

## ADDED Requirements

### Requirement: Apresentação vertical do conteúdo editorial

O bloco principal SHALL manter sua largura e posição, com título, categorias e pratos centralizados numa única sequência vertical fiel aos arquivos Markdown originais. Pratos SHALL NOT ser separados por linhas divisórias. Cada título de categoria SHALL ter somente uma linha decorativa vinho, centralizada e aproximadamente 20–30 px mais larga que o título.

#### Scenario: Leitura das categorias e pratos
- **WHEN** uma pessoa percorre qualquer página de cardápio
- **THEN** encontra títulos, categorias e pratos centralizados na coluna única, espaçamento vertical confortável, uma linha decorativa sob cada categoria e nenhuma linha entre pratos, preservando a ordem original sem alterações editoriais

### Requirement: Navegação circular entre cardápios disponíveis

Cada página de cardápio SHALL permitir navegar circularmente entre todos os cardápios disponíveis, independentemente da quantidade, com controles acessíveis por teclado/toque e gesto horizontal em celular.

#### Scenario: Navegação anterior e próxima
- **WHEN** a pessoa usa os controles de navegação num cardápio
- **THEN** chega ao cardápio anterior ou próximo e a navegação continua circular nos limites da coleção disponível

#### Scenario: Gesto horizontal em celular
- **WHEN** a pessoa faz gesto horizontal na página em dispositivo móvel
- **THEN** pode navegar ao cardápio adjacente sem que o gesto seja o único meio de navegação

### Requirement: Retorno à seção de cardápios da Home

O link de retorno em cada página SHALL ser identificado como “Voltar aos cardápios” e direcionar à seção de cardápios da Home.

#### Scenario: Retorno a partir de um cardápio
- **WHEN** a pessoa ativa o link de retorno
- **THEN** chega à âncora `#cardapios` da Home

### Requirement: Páginas dedicadas dos cardápios disponíveis

O site SHALL oferecer uma página em `/cardapios/:slug` para cada cardápio disponível na fonte de conteúdo e SHALL permitir chegar a cada uma a partir da Home e da navegação pública.

#### Scenario: Acesso a cardápio existente

- **WHEN** uma pessoa abre `/cardapios/italiano`, `/cardapios/churrasco` ou `/cardapios/contemporaneo`
- **THEN** encontra uma página dedicada com título do cardápio e uma lista legível das categorias e pratos correspondentes

#### Scenario: Identificador de cardápio desconhecido

- **WHEN** uma pessoa abre `/cardapios/` com um identificador que não consta da fonte de conteúdo
- **THEN** recebe estado de página não encontrada e um caminho claro para voltar à Home ou aos cardápios válidos

### Requirement: Fidelidade na apresentação de categorias e pratos

A página de cardápio SHALL renderizar todos os nomes, categorias e pratos da fonte tipada na mesma grafia e ordem do cardápio de origem; SHALL NOT criar descrições, preços, ingredientes, bebidas, sobremesas ou quantidades ausentes.

#### Scenario: Leitura completa de um cardápio

- **WHEN** uma pessoa percorre um cardápio publicado
- **THEN** encontra todas as categorias e todos os itens desse cardápio, na ordem original, sem deduplicação entre cardápios

#### Scenario: Conteúdo editorial atualizado de modo válido

- **WHEN** o desenvolvedor atualiza um arquivo editorial válido e os dados tipados são regenerados
- **THEN** a página correspondente reflete os novos nomes e a nova ordem sem exigir uma lista de pratos codificada na interface

### Requirement: Consulta sem seleção prematura

As páginas de cardápio SHALL oferecer acesso a outros cardápios e informação verdadeira sobre o processo de orçamento; enquanto `/orcamento` e `/montar` não existirem, SHALL NOT simular escolha, personalização, envio de pedido ou disponibilidade comercial.

#### Scenario: Visitante deseja continuar após conhecer um cardápio

- **WHEN** a pessoa chega ao fim da página de um cardápio nesta entrega
- **THEN** consegue consultar os demais cardápios e a explicação da jornada futura, sem botão que a direcione a fluxo inexistente

### Requirement: Conteúdo acessível e indexável sem dados inventados

As páginas de cardápio SHALL expor títulos e listas semânticas legíveis por leitor de tela e conteúdo de cada cardápio em HTML pré-renderizado; metadados por página SHALL identificar o cardápio sem inventar endereço, telefone, preço ou domínio oficial.

#### Scenario: Consulta sem execução de scripts

- **WHEN** um mecanismo de busca ou navegador sem JavaScript lê o HTML gerado de um cardápio conhecido
- **THEN** encontra o título, as categorias, os itens e metadados próprios da página

#### Scenario: Leitura por teclado e leitor de tela

- **WHEN** uma pessoa percorre uma página de cardápio por teclado e leitor de tela
- **THEN** os títulos das categorias e as listas de pratos são apresentados em sequência lógica e os links têm nomes compreensíveis
