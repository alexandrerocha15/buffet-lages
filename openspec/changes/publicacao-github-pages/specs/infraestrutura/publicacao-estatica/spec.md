# Spec Delta

## Purpose

Define a publicação reproduzível do site estático do Buffet Lages no GitHub Pages, preservando acesso às páginas pré-renderizadas sob um caminho base de projeto.

## ADDED Requirements

### Requirement: Build compatível com o caminho base publicado

O site SHALL carregar a aplicação e seus recursos estáticos no endereço de projeto `https://alexandrerocha15.github.io/buffet-lages/`, sem depender da raiz do domínio.

#### Scenario: Abrir a Home publicada

- **WHEN** uma pessoa acessa a Home no endereço de projeto publicado
- **THEN** a aplicação, estilos, fontes, favicon e imagens carregam sob o prefixo `/buffet-lages/`, sem requisições indevidas à raiz do domínio

### Requirement: Acesso direto às rotas pré-renderizadas

Cada rota pública suportada SHALL ser entregue como HTML estático pré-renderizado e SHALL continuar acessível por link interno, acesso direto e atualização da página no GitHub Pages.

#### Scenario: Abrir ou atualizar uma rota suportada

- **WHEN** uma pessoa abre diretamente ou atualiza uma rota pública pré-renderizada
- **THEN** o GitHub Pages entrega o HTML correspondente e a aplicação mantém a rota e carrega os recursos necessários

#### Scenario: Navegar entre páginas suportadas

- **WHEN** uma pessoa usa a navegação interna para abrir outra rota suportada
- **THEN** a URL permanece sob `/buffet-lages/` e o conteúdo da rota de destino é exibido

### Requirement: Publicação automatizada a partir da main

O repositório SHALL validar o build estático e publicar o artefato resultante no GitHub Pages a partir da branch `main`, sem publicar versões de branches de trabalho.

#### Scenario: Atualização da branch de produção

- **WHEN** uma alteração é integrada à branch `main` e as validações do workflow passam
- **THEN** o artefato de produção é publicado no GitHub Pages com permissões de workflow limitadas ao necessário

#### Scenario: Build ou validação falha

- **WHEN** instalação, verificações ou build falham
- **THEN** o workflow não publica o artefato daquela execução

### Requirement: Número oficial de WhatsApp na publicação

O site publicado SHALL direcionar solicitações ao número oficial confirmado `5549991014293`; o número no cliente SHALL ser tratado como dado público, nunca como credencial ou segredo.

#### Scenario: Solicitação de orçamento

- **WHEN** a pessoa confirma a abertura do WhatsApp no fluxo de orçamento publicado
- **THEN** o link usa o número oficial confirmado e a mensagem preparada, sem enviar dados a um serviço próprio
