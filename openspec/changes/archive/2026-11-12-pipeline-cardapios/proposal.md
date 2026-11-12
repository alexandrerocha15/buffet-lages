# Proposal

## Why

Os três cardápios reais existem apenas como Markdown editorial em `assets/cardapios/`, e o site ainda não possui nenhuma forma confiável de transformá-los em dados tipados. Sem um pipeline em tempo de build, as próximas telas dependeriam de parsing em runtime — proibido pelo PRD e pelo TDD — ou de dados copiados à mão, sujeitos a divergência silenciosa em relação aos originais.

## What Changes

- Adicionar um parser estrito, executado somente em tempo de build, que lê os arquivos de `assets/cardapios/*.md` como fonte editorial somente leitura.
- Validar a estrutura dos cardápios e falhar a geração com mensagem acionável (arquivo e linha) quando o formato esperado for violado.
- Gerar dados tipados determinísticos em `src/app/content/` (diretório já ignorado pelo Git), preservando nomes, categorias e ordem exatamente como nos originais.
- Derivar o catálogo unificado com chave normalizada de prato para uso futuro na montagem de seleção, mantendo a deduplicação fora dos cardápios originais.
- Falhar a geração quando o mesmo prato aparecer em categorias diferentes entre cardápios.
- Introduzir os modelos de domínio de cardápio e a interface `MenuSource` com uma implementação estática que consome os dados gerados, sem parsing de Markdown em runtime.
- Adicionar testes de fidelidade calculados a partir dos próprios arquivos originais, sem depender de contagens fixas, executados por comando dedicado e como portão do build.
- Integrar geração e verificação aos scripts npm (`prestart`, `prebuild`, `pretest`) e configurar o runner de testes do pipeline fora do bundle da aplicação.

**Fora do escopo:** páginas e componentes visuais, rotas e prerender dinâmico, seleção de pratos, formulário de orçamento, mensagem/WhatsApp, SEO, pipeline de imagens, backend e qualquer item da Etapa 2.

## Capabilities

### New Capabilities

- `conteudo/cardapios`: leitura e validação dos cardápios Markdown originais, geração do catálogo tipado em tempo de build, catálogo unificado normalizado e garantia de fidelidade aos originais.

### Modified Capabilities

Nenhuma.

## Impact

- Novos arquivos em `scripts/` (parser, geração e testes de fidelidade) e configuração de teste Node/Vitest.
- Novos modelos em `src/app/core/models/` e fonte de conteúdo em `src/app/core/content/`.
- Novos arquivos gerados em `src/app/content/`, já cobertos por `.gitignore`; o build passa a depender da geração antes da compilação Angular.
- `package.json` ganha scripts de geração e verificação; `tsconfig`/configuração de teste do pipeline são ajustados.
- Nenhuma alteração em `assets/cardapios/`, `assets/fotos/`, PRD ou TDD.
- Nenhuma chamada HTTP, persistência, rota visível ou mudança de comportamento de interface nesta mudança.
