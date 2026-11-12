# Tasks

## 1. Fixar a base de ferramentas

- [x] 1.1 Confirmar a versão Angular estável e a versão Node.js LTS vigentes no início da implementação, verificando compatibilidade entre si e registrando-as no projeto; verificar com `npm ci` após gerar/atualizar os manifests e lockfile.
- [x] 1.2 Inicializar a aplicação com Angular CLI e builder `@angular/build:application`, mantendo standalone e npm; verificar que a estrutura-base e os arquivos de configuração Angular esperados foram criados.

## 2. Configurar estrutura e qualidade

- [x] 2.1 Criar somente a estrutura inicial de diretórios e arquivos-base prevista em `docs/06-tdd.md` para esta fundação, sem implementar features ou pipelines; verificar a árvore contra a seção 2.2 do TDD.
- [x] 2.2 Configurar TypeScript `strict`, ESLint, Prettier, `.nvmrc`, `engines` e scripts npm compatíveis com as versões escolhidas; verificar com os comandos de lint e formatação definidos no `package.json`.
- [x] 2.3 Configurar o runner unitário de acordo com a compatibilidade da versão Angular (Vitest se suportado; senão Karma/Jasmine padrão), sem criar testes de regras de funcionalidades futuras; verificar que o comando de testes executa e termina com sucesso.

## 3. Preparar e validar o build estático

- [x] 3.1 Configurar prerender no build Angular e uma rota inicial mínima, sem conteúdo institucional ou páginas funcionais; verificar com o build de produção que a saída contém HTML pré-renderizado para essa rota.
- [x] 3.2 Verificar integração da fundação com `npm ci`, lint, runner unitário e build de produção/prerender; confirmar por inspeção do diff que não foram alterados PRD, TDD, README ou originais em `assets/`, e que não foram incluídos backend, armazenamento, deploy ou itens da Etapa 2.
