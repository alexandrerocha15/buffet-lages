# Proposal

## Why

O repositório contém os documentos aprovados e os conteúdos originais, mas ainda não possui uma aplicação Angular ou um build executável. Uma fundação técnica mínima permite iniciar as próximas mudanças sobre a stack, a estrutura e a estratégia de prerender já definidas no TDD, sem antecipar funcionalidades do site.

## What Changes

- Criar a aplicação Angular inicial com versões estáveis vigentes na implementação e dependências fixadas no projeto.
- Estabelecer a estrutura inicial de pastas e arquivos conforme a arquitetura aprovada no TDD, sem implementar funcionalidades das próximas mudanças.
- Configurar TypeScript strict, lint, formatação, npm e os arquivos de versão/compatibilidade de Node.js previstos no TDD.
- Preparar o build Angular com `@angular/build:application` e prerender habilitado, verificável por build local.
- Definir scripts básicos de desenvolvimento, validação e build; não incluir ainda os pipelines de geração de cardápios, imagens ou rotas dinâmicas.
- Preservar sem alterações o PRD, o TDD (exceto correções autorizadas), o README e os originais em `assets/`.

## Capabilities

### New Capabilities

Nenhuma. Esta mudança estabelece tooling e estrutura interna, sem introduzir comportamento funcional observável do produto.

### Modified Capabilities

Nenhuma.

## Impact

- Novos arquivos de aplicação e configuração na raiz e em `src/`.
- Dependências de desenvolvimento e scripts npm para Angular, qualidade estática e build.
- A saída deve ser estática/pré-renderizada e não depender de SSR em runtime.
- Nenhuma API, banco de dados, login, painel administrativo ou funcionalidade da Etapa 2 será incluída.
- Nenhuma dependência deve ler ou modificar os arquivos originais de `assets/` nesta mudança.
