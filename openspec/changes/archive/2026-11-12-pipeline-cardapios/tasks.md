# Tasks

## 1. Modelo de domínio e chave normalizada

- [x] 1.1 Criar os tipos de cardápio (`Menu`, `Category`, `Dish`) e de catálogo unificado (`CatalogCategory`, `CatalogDish`) em `src/app/core/models/`, somente leitura, sem campos de preço, descrição, porção ou disponibilidade; verificar com `npx tsc -p tsconfig.app.json --noEmit` e lint.
- [x] 1.2 Implementar `normalizeDishKey` (trim → minúsculas → colapso de espaços internos) como função pura, com testes que cubram espaços, caixa, acentos preservados e variações de nome mantidas separadas; verificar com `npm run test:content`.

## 2. Parser estrito dos cardápios

- [x] 2.1 Implementar o parser puro que recebe o texto e o nome de origem e devolve `Menu`, com erro contendo arquivo e linha; verificar com fixture válida usando CRLF, sem quebra final e nomes acentuados, comparando título, categorias, itens e ordem exatamente.
- [x] 2.2 Rejeitar UTF-8 inválido, BOM, texto antes do H1, mais de um H1, subtítulo diferente de `**Buffet Lages**`, item fora de categoria, categoria sem itens e linha fora do formato; verificar com fixtures que asseguram mensagem acionável e ausência de resultado parcial.
- [x] 2.3 Garantir que o parser não corrija nem normalize nomes e categorias (incluindo grafias como “Talharinho” e “Carpaccio de frutas frescas”); verificar comparando a saída do parser com os textos originais dos três arquivos reais.

## 3. Catálogo unificado

- [x] 3.1 Implementar a derivação do catálogo unificado agrupado pela categoria original, com nome da primeira ocorrência e lista de slugs onde cada prato aparece; verificar com teste que confirma deduplicação de pratos repetidos e ordem de primeira aparição.
- [x] 3.2 Detectar conflito de categoria para a mesma chave normalizada e interromper a geração com mensagem que identifica prato e categorias; verificar com fixture sintética que hoje não ocorre nos cardápios reais.
- [x] 3.3 Confirmar que os cardápios de origem mantêm suas listas completas e repetições, enquanto apenas o catálogo deduplica; verificar com teste que conta ocorrências nos cardápios e itens únicos no catálogo.

## 4. Geração em tempo de build

- [x] 4.1 Implementar o CLI de geração que lê `assets/cardapios/*.md` como bytes com decodificação UTF-8 fatal, ordena os arquivos por nome, valida tudo em memória e rejeita slugs duplicados; verificar que uma falha não escreve saída e que uma execução válida cria o módulo gerado.
- [x] 4.2 Emitir `src/app/content/menus.generated.ts` como dados `readonly` tipados por `core/models`, com cabeçalho de arquivo gerado e quebras LF; verificar que duas execuções consecutivas produzem conteúdo idêntico e que o arquivo não é versionado (`git status` limpo para o diretório).
- [x] 4.3 Configurar `vitest.content.config.ts` (ambiente `node`, `scripts/**/*.spec.ts`), `tsconfig.scripts.json` e os scripts npm `generate:menus`, `test:content` e `verify:content`, ligando `prestart`, `prebuild` e `pretest`; verificar `npm run build` a partir de `src/app/content/` ausente e confirmar que a geração ocorre antes da compilação.
- [x] 4.4 Excluir `src/app/content/` do ESLint e do Prettier para não validar artefato gerado; verificar com `npm run lint` e `npm run format:check`.

## 5. Fonte de conteúdo para a aplicação

- [x] 5.1 Implementar `MenuSource` com `loadMenus(): Promise<readonly Menu[]>` e a implementação estática que resolve com os dados gerados, sem I/O e sem parsing; verificar com teste que a promessa resolve os cardápios na ordem determinística e com categorias e itens preservados.
- [x] 5.2 Confirmar que nenhum componente ou serviço importa o módulo gerado diretamente e que a aplicação não recebe os `.md` originais nem interpretador de Markdown; verificar com `npm run build` e inspeção de `dist/` (nenhum `.md` e nenhum código de parsing no bundle).

## 6. Fidelidade e integração

- [x] 6.1 Implementar o teste de fidelidade com extrator independente das linhas `#`, `##` e `- ` dos arquivos reais, comparando nomes, categorias, ordem, contagens de ocorrências e pratos do catálogo com os dados gerados; verificar com `npm run test:content` e com o teste falhando ao ser apontado para dados divergentes.
- [x] 6.2 Garantir que alterações legítimas de conteúdo não quebrem testes por números fixos e que os originais permaneçam inalterados após a geração (comparação de conteúdo antes/depois); verificar com fixture de cardápio ampliado e com hash/conteúdo dos três arquivos.
- [x] 6.3 Documentar os comandos do pipeline e o formato aceito dos Markdown em `docs/07-pipeline-cardapios.md`; verificar que os comandos documentados executam como escritos.
- [x] 6.4 Executar a verificação integrada — `npm run verify:content`, `npm run test`, `npm run lint`, `npm run format:check` e `npm run build` — e confirmar por `git status` que PRD, TDD, README, `assets/` e documentos aprovados não foram alterados e que nenhuma página, rota, seleção, formulário ou WhatsApp foi implementado.

## Workflow follow-up

- Aguardar a aprovação dos artefatos de planejamento antes de iniciar o Apply.
- Arquivar a mudança somente após a implementação validada e a revisão do projeto.
