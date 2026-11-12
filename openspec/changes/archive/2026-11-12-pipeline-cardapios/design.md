# Design

## Context

Ver `proposal.md` para motivação e escopo. O projeto já possui a fundação Angular (standalone, builder `@angular/build:application`, prerender, TypeScript strict, ESLint, Prettier e Vitest 5), mas `scripts/` está vazio, `src/app/core/content/` e `src/app/core/models/` contêm apenas marcadores, e `src/app/content/` já está no `.gitignore` sem nada que o gere. O PRD 0.4 e o TDD 0.2 fixam as regras que condicionam este desenho: origem somente leitura, parser estrito em build, nenhuma interpretação de Markdown em runtime, preservação de nomes/categorias/ordem, deduplicação apenas no catálogo de seleção e testes de fidelidade derivados dos próprios arquivos (§6 do TDD).

Os três arquivos atuais usam UTF-8, quebras CRLF e o mesmo formato: H1, subtítulo `**Buffet Lages**`, categorias H2 e itens `- `. O último item não é seguido de quebra de linha. O pipeline precisa aceitar esse estado real sem normalizar o conteúdo editorial.

## Goals / Non-Goals

**Goals:**

- Produzir dados tipados determinísticos, consumíveis pela aplicação, a partir dos três arquivos reais.
- Detectar desvios de formato e de fidelidade antes de qualquer compilação Angular.
- Manter o parser e os testes fora do bundle do cliente e independentes de APIs de navegador.
- Deixar explícito o contrato de consumo (`MenuSource`) que as próximas mudanças usarão.

**Non-Goals:**

- Gerar rotas, páginas, componentes, SEO ou sitemap.
- Implementar seleção, personalização, formulário ou WhatsApp.
- Interpretar Markdown, validar semântica culinária ou corrigir grafias.
- Processar imagens, criar CMS, backend ou persistência.

## Decisions

1. **Parser próprio, estrito e sem biblioteca de Markdown.** O formato é fixo e pequeno; uma biblioteca genérica aceitaria variações que precisam falhar. Alternativa considerada: `remark`/`markdown-it`; rejeitada por esconder desvios e adicionar superfície desnecessária. O parser recebe texto (não caminho de arquivo), o que o torna testável sem I/O.

2. **Separar parser puro, regras de catálogo e CLI de geração.** `parseMenu(text, sourceName)` devolve o cardápio ou lança erro com arquivo e linha; a derivação do catálogo unificado é uma função pura sobre cardápios; um CLI lê o diretório, valida tudo em memória e só então escreve a saída. Alternativa considerada: um único script monolítico; rejeitada por dificultar testes unitários e a checagem de conflitos com fixtures sintéticas.

3. **Ler bytes e decodificar UTF-8 de forma fatal.** A leitura usa `Buffer` + `TextDecoder('utf-8', { fatal: true })`, normaliza CRLF/CR para LF e rejeita BOM ou qualquer texto antes do H1. Alternativa considerada: `readFileSync(path, 'utf8')`; rejeitada porque substitui bytes inválidos silenciosamente por `�`, mascarando corrupção de conteúdo.

4. **Saída como módulo TypeScript gerado, não JSON.** O arquivo `src/app/content/menus.generated.ts` exporta dados `readonly` tipados, importando apenas tipos de `core/models`; é emitido com `JSON.stringify(data, null, 2)`, quebras LF e cabeçalho “gerado automaticamente”. Alternativa considerada: JSON + `resolveJsonModule`; rejeitada por exigir configuração extra e por perder a checagem de forma no ponto de importação.

5. **Modelo mínimo, sem campos inventados.** `Menu { slug, title, categories }`, `Category { name, dishes }` e `Dish { name }`; não há preço, descrição, porção ou disponibilidade. `slug` vem do nome do arquivo sem extensão, validado como único. A chave normalizada (`normalizeDishKey`: trim → minúsculas → colapso de espaços) é função pura em `core/models` e não é armazenada em cada prato.

6. **Catálogo unificado calculado no build e emitido ao lado dos cardápios.** `CatalogCategory { name, dishes }` e `CatalogDish { key, name, menus }`, agrupados pela categoria original e ordenados pela primeira aparição ao percorrer os cardápios em ordem de arquivo. O nome exibido é o da primeira ocorrência; `menus` lista os slugs onde o prato aparece. Conflito de categoria para a mesma chave interrompe a geração (hoje não ocorre). Alternativa considerada: calcular o catálogo em runtime; rejeitada porque o TDD exige que o conflito falhe o build e porque o dado é estável.

7. **Ordem determinística entre cardápios.** Os arquivos são ordenados por nome (comparação de código, não locale), garantindo saída idêntica em Windows, Linux e CI. Dentro de cada cardápio, categorias e itens mantêm exatamente a ordem do arquivo. A ordem de apresentação na interface será decidida na mudança de páginas; o pipeline não impõe ordem editorial.

8. **Testes do pipeline em Vitest modo Node, com configuração própria.** O builder `@angular/build:unit-test` restringe `include` à raiz de código da aplicação e empacota para ambiente de teste Angular; importar `node:fs` ali criaria atrito desnecessário. Um `vitest.content.config.ts` executa `scripts/**/*.spec.ts` em ambiente `node`, reutilizando o Vitest já fixado. Alternativa considerada: testes dentro de `src/`; rejeitada por misturar código de build com código de aplicação e arriscar dependências Node no bundle.

9. **Fidelidade verificada por extrator independente.** O teste de fidelidade não reutiliza o parser para montar a expectativa: extrai H1, `##` e `- ` diretamente das linhas originais e compara com a saída gerada; calcula contagens, ordem e unicidade a partir dessa extração. Assim, um bug no parser não se auto-valida. Fixtures inline cobrem formatos inválidos e conflitos de categoria, sem escrever no repositório.

10. **Portões npm: `prestart`, `prebuild` e `pretest`.** `generate:menus` valida e escreve; `test:content` executa a suíte Node; `verify:content` encadeia geração, checagem de tipos dos scripts e fidelidade. `prebuild` chama `verify:content`, então `npm run build` falha se o Markdown divergir. `prestart` e `pretest` geram os dados para desenvolvimento e testes que importem o módulo. Alternativa considerada: apenas CI; rejeitada porque o TDD exige que a divergência falhe o build local também.

11. **Fronteira de conteúdo conforme o TDD.** `MenuSource` expõe `loadMenus(): Promise<readonly Menu[]>` e `StaticMenuSource` resolve a promessa com os dados gerados; nenhum componente importa o módulo gerado diretamente. Sem `HttpClient`, sem I/O em runtime. Alternativa considerada: acesso síncrono direto; rejeitada para manter o contrato substituível por uma futura fonte de API.

12. **Exclusões de qualidade.** `src/app/content/` é ignorado por ESLint e Prettier para não validar artefato gerado; `.gitignore` já o cobre. Nenhum arquivo em `assets/` é escrito; um teste compara o conteúdo dos originais antes e depois da geração.

## Risks / Trade-offs

- [Parser estrito quebra o build em edições legítimas com formato diferente] → Mensagens com arquivo e linha, formato documentado no design e testes de fixture que mostram o esperado; a correção é no Markdown, nunca no parser em runtime.
- [Teste de fidelidade reimplementar a extração e divergir do parser] → Extração mínima e deliberadamente simples, baseada apenas em prefixos de linha; casos de fidelidade usam os arquivos reais, não fixtures.
- [Contagens mudam quando a empresa aprovar cardápios novos] → Nenhuma expectativa fixa: totais são calculados dos originais no momento do teste.
- [Ordem entre cardápios depender do sistema de arquivos] → Ordenação explícita por nome e teste de determinismo executando a geração duas vezes.
- [Arquivo gerado ausente em editor ou typecheck antes do primeiro build] → `prestart`, `prebuild` e `pretest` geram antes de compilar/testar; a ausência produz erro claro de módulo não encontrado, não dados vazios silenciosos.
- [Windows com CRLF e acentos] → Normalização de quebra de linha, decodificação UTF-8 fatal e teste com os nomes acentuados reais.
- [Executar Vitest dentro do `prebuild` aumenta o tempo de build] → Suíte restrita a `scripts/`, sem Angular TestBed, com poucos casos e leitura apenas dos três arquivos.
- [Duplicação entre cardápios e catálogo unificado] → Catálogo é derivado e somente leitura; conflito de categoria falha a geração, impedindo divergência silenciosa.

## Migration Plan

Não há migração de dados nem de usuários. A mudança cria arquivos novos e liga scripts npm; `src/app/content/` passa a ser gerado localmente e continua fora do versionamento. Rollback consiste em remover os scripts, a configuração de teste e o diretório gerado, restaurando os hooks do `package.json`; os originais e documentos aprovados não são tocados em nenhum cenário.
