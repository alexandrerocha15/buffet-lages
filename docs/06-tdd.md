# TDD — Etapa 1: Site Buffet Lages (Technical Design Document)

**Versão:** 0.2 — ajustes da revisão solicitada (datas, recarregamento, indexação, fidelidade); estrutura técnica aprovada, aguardando aprovação definitiva.
**Base:** `docs/04-prd-inicial.md` (PRD 0.4 aprovado) e estrutura técnica aprovada pelo responsável.
**Produto:** site público institucional e comercial do Buffet Lages (Etapa 1), em Angular.
**Relação com o PRD:** o PRD define **o quê**; este documento define **como**. Nenhum requisito, regra de negócio ou critério de aceite é alterado aqui. Divergências, se houver, estão registradas explicitamente nas seções 16 e 17.
**Fora do escopo deste documento:** Etapa 2 (sistema de gestão de locações), CMS, backend, banco de dados, login, painel administrativo, preços ou cálculos. A integração com a API .NET é apenas **prevista** (seção 15), não implementada.

---

## 1. Objetivo e premissas

Desenhar a solução técnica do site da Etapa 1 para que ele:

1. apresente a empresa, as três fotografias reais e os três cardápios reais;
2. permita escolher um cardápio pronto, personalizá-lo ou montar uma seleção de pratos;
3. colete os dados do evento em formulário acessível e **encaminhe uma solicitação de orçamento ao WhatsApp**, sem preço, reserva ou contratação.

**Premissas que condicionam todo o desenho:**

- P-01 a P-07 do PRD são decisões aprovadas e obrigatórias.
- Cardápios e fotos são conteúdo real; **nada será inventado** (RB-14).
- Originais em `assets/` são **somente leitura** (RB-13).
- Sem armazenamento de dados pessoais no navegador: estado **apenas em memória** (RB-10, CA-18).
- Sem SSR em runtime: **prerender em build** + hospedagem estática (P-05).
- Dados oficiais ausentes (WhatsApp, domínio, SEO local, autorizações de imagem) **bloqueiam publicação, não o TDD** (seção 18).

---

## 2. Arquitetura Angular

### 2.1 Stack

| Item | Decisão |
|---|---|
| Framework | Angular **estável vigente no início da implementação** (previsto: ≥ 22 em nov/2026). Versão exata fixada no `package.json` na inicialização e registrada nesta seção |
| Node.js | LTS vigente, pinado em `.nvmrc` e `engines` |
| Componentes | **Standalone** (sem NgModules), `OnPush`, control flow `@if`/`@for` |
| Estado | **Signals** em services (`SelectionStore`, `QuoteFormStore`), escopo de aplicativo, memória pura |
| Build | `@angular/build:application` com **`prerender: true`** — HTML gerado no build, saída 100% estática |
| Rotas | Lazy loading por feature |
| Estilo | CSS puro com variáveis de design tokens (sem framework de UI) — mantém controle de contraste, alvos de toque e bundle |
| Qualidade | TypeScript `strict`, ESLint, Prettier |
| Gerenciador de pacotes | npm |

### 2.2 Estrutura de pastas

```
buffet-lages/
├── assets/
│   ├── cardapios/*.md              # fonte editorial dos cardápios (somente leitura)
│   └── fotos/*.png                 # originais preservados (nunca publicados crus)
├── scripts/                        # pipeline de build (TypeScript/Node)
│   ├── generate-menus.ts           # Markdown → dados tipados + validação
│   ├── generate-images.ts          # derivados AVIF/WebP + manifesto
│   └── generate-routes.ts          # rotas de prerender a partir do catálogo
├── public/                         # saída de arquivos estáticos (derivados de imagem, favicon)
│   └── img/
├── src/
│   ├── app/
│   │   ├── core/                   # domínio e serviços (sem dependência de UI)
│   │   │   ├── models/             # Menu, Category, Dish, Selection, QuoteRequest
│   │   │   ├── content/            # MenuSource (interface) + StaticMarkdownMenuSource
│   │   │   ├── whatsapp/           # message builder + url builder
│   │   │   ├── seo/                # título, meta, canonical, JSON-LD
│   │   │   └── selection/          # SelectionStore, QuoteFormStore
│   │   ├── content/                # GERADO em build, gitignored (dados tipados)
│   │   ├── shared/                 # componentes presentacionais reutilizáveis
│   │   ├── features/
│   │   │   ├── home/
│   │   │   ├── cardapios/
│   │   │   ├── montar/
│   │   │   ├── orcamento/
│   │   │   └── privacidade/
│   │   ├── layout/                 # header, footer, skip-link
│   │   └── app.routes.ts
│   ├── environments/               # baseUrl, whatsappNumber, apiBaseUrl (reservado)
│   └── styles/
├── e2e/                            # Playwright
├── docs/
└── angular.json
```

**Regra de dependências:** `features` → `shared` → `core`. `core` não importa UI. O conteúdo gerado (`src/app/content/`) é consumido exclusivamente por `core/content`, de modo que trocar a fonte (Markdown → API .NET) não toca componentes.

### 2.3 Camadas e responsabilidades

| Camada | Responsabilidade |
|---|---|
| **Domínio (`core/models`)** | Tipos e regras puras: normalização de chave de prato, agrupamento por categoria, formatação de data/local |
| **Fonte de conteúdo (`core/content`)** | `MenuSource` abstrai a origem dos cardápios (seção 6.5) |
| **Aplicação (`core/*` stores e serviços)** | Estado do fluxo, montagem da mensagem, metadados de SEO |
| **Apresentação (`shared` + `features`)** | Componentes sem regra de negócio relevante; formulários reativos delegam validação a funções puras testadas |

---

## 3. Modelo de domínio

Tipos ilustrativos (a forma exata é definida na implementação):

```ts
// Seleção de origem do pedido
type SelectionMode = 'pronto' | 'personalizado' | 'montado';

interface Selection {
  mode: SelectionMode;
  baseMenuSlug?: string;      // presente em 'pronto' e 'personalizado'
  dishes: Dish[];             // snapshot final escolhido pelo cliente
}

// Data: exatamente três estados (P-03 / RB-06)
type EventDate =
  | { kind: 'defined'; iso: string }                      // dia, mês e ano
  | { kind: 'approximate'; month: number; year: number }  // mês e ano
  | { kind: 'unknown' };                                  // ainda não sei

type EventLocation =
  | { kind: 'defined'; city: string; venue?: string; address?: string }
  | { kind: 'unknown' };

interface QuoteRequest {
  selection: Selection;
  guestName: string;
  guestCount: number;
  date: EventDate;
  location: EventLocation;
  notes?: string;
}
```

**Regras do modelo:**

- `Menu` → `Category[]` → `Dish[]` preservam **ordem, grafia e categorias exatas** dos Markdown originais.
- Chave normalizada de prato: `trim` → minúsculas → espaços colapsados. Variantes de nome permanecem chaves distintas (P-14).
- Conflito de categoria (mesmo prato em categorias diferentes entre cardápios) → **falha do build** (hoje não ocorre: os cinco pratos repetidos — maionese, espaguete na manteiga, galeto na brasa, pernil suíno na brasa e carpaccio de frutas — mantêm a mesma categoria em todos os cardápios).
- Não existe modelo de preço, porção ou disponibilidade em nenhuma parte do desenho.

---

## 4. Componentes

### 4.1 Shell e layout

| Componente | Responsabilidade |
|---|---|
| `AppComponent` | Esqueleto: skip link, `<header>`, `<router-outlet>`, `<footer>` |
| `HeaderComponent` | Navegação simples, menu mobile acessível (botão com `aria-expanded`), **CTA persistente “Solicitar orçamento”** |
| `FooterComponent` | Links institucionais, privacidade, aviso de que orçamento não é contratação (conteúdo pendente de P-08) |
| `SkipLinkComponent` | “Pular para o conteúdo”, primeiro focável da página |
| `NotFoundComponent` | Página 404 com retorno à home |

### 4.2 Shared (presentacional)

| Componente | Uso |
|---|---|
| `PhotoGalleryComponent` | As três fotografias com `srcset`, dimensões explícitas, lazy loading; modal opcional apenas para ampliar (P-04) |
| `MenuCardComponent` | Resumo de cardápio na home (nome, categorias, contagem, CTA) |
| `CategorySectionComponent` | Título de categoria + lista de itens |
| `DishCheckboxComponent` | Item selecionável com estado claro (checkbox/cartão), sem drag-and-drop (P-03) |
| `StepperComponent` | Indicador das 3 etapas do orçamento, com estado atual em `aria-current` |
| `FieldComponents` | `GuestsField`, `DateField`, `LocationField`, `NotesField` — rótulo, ajuda e erro ligados por `aria-describedby` |
| `SummaryComponent` | Resumo em seções com ações “Editar” e “Abrir WhatsApp” (P-03) |
| `NoticeComponent` | Avisos fixos: “cliente envia a mensagem”, “orçamento não é contratação”, e o aviso de perda da seleção ao atualizar a página (§7.3) (RF-10, CA-18) |
| `CtaBannerComponent` | Chamada para orçamento reutilizável |

### 4.3 Features

| Rota | Componente | Conteúdo |
|---|---|---|
| `/` | `HomeComponent` | Destaque (foto principal), sobre, galeria, resumo dos três cardápios, “como funciona”, CTA |
| `/cardapios/:slug` | `MenuPageComponent` | Categorias e itens **originais** + ações “Solicitar com este cardápio” (RF-04) e “Personalizar este cardápio” (RF-05) |
| `/montar` | `BuildSelectionPageComponent` | Catálogo unificado em checkboxes por categoria; atende **montar do zero (RF-06)** e **personalizar com base (RF-05)** conforme `SelectionStore.mode`; resumo lateral/fixo com contagem e CTA |
| `/orcamento` | `QuotePageComponent` | 3 etapas internas: **seleção (RF-07) → dados (RF-08) → revisão** + `WhatsAppPreviewComponent` |
| `/politica-de-privacidade` | `PrivacyPageComponent` | Política e aviso de privacidade (conteúdo pendente de P-08) |

**Por que uma rota só para `/orcamento`:** P-04 determina evitar múltiplas rotas que possam perder a seleção no recarregamento. As etapas são estado interno do componente, não rotas.

---

## 5. Rotas, pré-renderização e navegação

| Rota | Prerender em build | Indexação | Metadados |
|---|---|---|---|
| `/` | ✅ | **index** | título/descrição da home |
| `/cardapios/italiano` | ✅ | **index** | título/descrição únicos |
| `/cardapios/churrasco` | ✅ | **index** | título/descrição únicos |
| `/cardapios/contemporaneo` | ✅ | **index** | título/descrição únicos |
| `/montar` | ✅ (shell estático) | **noindex** | sem canonical fora do sitemap |
| `/orcamento` | ✅ (shell estático) | **noindex** | sem canonical fora do sitemap |
| `/politica-de-privacidade` | ✅ | **index** | título/descrição únicos |
| qualquer outra | ✅ (404) | noindex | — |

Decisão **aprovada na revisão da v0.2** (seção 16.2): o PRD indexa home e cardápios; a política de privacidade é **indexada**, e `/montar` e `/orcamento` permanecem com **`noindex`**.

**Geração das rotas dinâmicas:** `scripts/generate-routes.ts` lê o catálogo gerado e escreve a lista de rotas de prerender (`/cardapios/<slug>`), consumida pela configuração de build. Um **teste de fidelidade** compara a lista de rotas com o catálogo — cardápio novo sem rota = falha do build (mitiga o risco registrado na §13 do PRD).

**Navegação e acessibilidade:**

- Gestão de foco em toda troca de rota: foco para o `<main>` ou título da página.
- Nas trocas de etapa do orçamento: foco para o título da nova etapa + anúncio em região `aria-live="polite"`.
- Menu mobile acessível por teclado, sem depender de hover (CA-14).
- Sem carrossel automático, sem gestos complexos, sem drag-and-drop.

---

## 6. Pipeline dos cardápios Markdown (P-07)

### 6.1 Fluxo (somente em tempo de build)

```
assets/cardapios/*.md  (somente leitura)
        │
        ▼
[1] Parser estrito (scripts/generate-menus.ts)
        │  formato esperado: "# Título", "**Buffet Lages**", "## Categoria", "- item"
        ▼
[2] Validação de schema  ── desvio? ──▶ FALHA O BUILD
        │
        ▼
[3] Dados tipados (Menu/Category/Dish, ordem preservada)
        │
        ├──────────────▶ [4] Catálogo unificado (dedup)  ──▶ só para /montar
        │
        ▼
[5] src/app/content/ (gerado, gitignored)
        │
        ▼
[6] Testes de fidelidade  ── divergência? ──▶ FALHA O BUILD
        │
        ▼
[7] generate-routes.ts → rotas de prerender
```

### 6.2 Decisões de implementação

- **Parser próprio e estrito**, sem biblioteca Markdown: o formato dos arquivos é fixo e simples; uma biblioteca genérica esconderia desvios que precisam quebrar o build.
- **Sem parsing em runtime** — o cliente nunca recebe Markdown nem interpretador de Markdown.
- **Gerado, não commitado:** `src/app/content/` entra no `.gitignore`; fonte única são os originais. Scripts `generate:menus` rodam em `prestart`/`prebuild` e no CI.
- **Escapamento:** o conteúdo gerado é serializado como dados (JSON/TS), nunca como HTML confiado; os componentes renderizam via interpolação Angular (proteção XSS por construção).

### 6.3 Testes de fidelidade (obrigatórios, falham o build)

A validação é **rigorosa, mas derivada dos próprios arquivos Markdown**: nenhuma asserção depende de número fixo que impeça alteração legítima de conteúdo no futuro (RF-11). Duas camadas:

**a) Validação estrutural — acompanha os arquivos em todo build**

| Verificação | Como é calculada |
|---|---|
| Formato | exatamente 1 H1 por arquivo; subtítulo presente; nenhum item fora de categoria; nenhum token fora do formato aceito |
| Conteúdo mínimo | cada cardápio tem ≥ 1 categoria e ≥ 1 item (arquivo não vazio) |
| Itens por cardápio, total de ocorrências e pratos únicos do catálogo | **derivados em tempo de teste** a partir dos originais (linhas `##` e `- `) e comparados com os dados gerados |
| Nomes e ordem | byte a byte com os originais (inclui “Talharinho”, “Carpaccio de frutas frescas” — P-14) |
| Categorias | nomes e ordem exatos dos originais; o pipeline **não pode inventar categoria** — como não existe “sobremesas” nos arquivos, ela não aparece (RB-04, RB-14) |
| Pratos do catálogo unificado | ⊆ pratos dos originais, com chave normalizada correta (§6.4) |
| Conflito de categoria de prato repetido | falha do build (não ocorre hoje) |
| Rotas de prerender | lista gerada = catálogo (seção 5) |

**b) Referência inicial — apenas sanidade da primeira implementação**

Valores vigentes na data desta versão, registrados para conferência manual no arranque do projeto. **Esta tabela é documental: os testes não a consultam** — alterações futuras legítimas nos cardápios não quebram o build.

| Cardápio | Categorias | Itens |
|---|---|---|
| Italiano | Carnes 2; Massas e acompanhamentos 4; Saladas 4 | 10 |
| Churrasco | Carnes 4; Massas e acompanhamentos 5; Saladas 6 | 15 |
| Contemporâneo | Pratos principais 4; Saladas 4 | 8 |

- Total de ocorrências: **33**; pratos únicos no catálogo: **26** (33 − 7 repetições: maionese ×3, espaguete na manteiga ×3, galeto ×2, pernil suíno ×2, carpaccio de frutas ×2).

### 6.4 Regras de deduplicação (RB-05)

- Chave: `trim` → minúsculas → espaços colapsados.
- Deduplicação **apenas** no catálogo de `/montar`; os três cardápios mantêm listas e repetições originais.
- Variantes de nome permanecem separadas até P-14: “Carpaccio de frutas” ≠ “Carpaccio de frutas frescas”; “Arroz” ≠ “Arroz branco”; “Seleção de legumes da estação” ≠ “Mix de legumes da estação”.

### 6.5 Interface de fonte de conteúdo (ponte futura)

```ts
interface MenuSource {
  loadMenus(): Promise<Menu[]>;
}
```

- **Agora:** `StaticMarkdownMenuSource` — lê os dados gerados em tempo de build.
- **Futuro (não implementar):** `ApiMenuSource` — consome a API .NET via `apiBaseUrl` (seção 15).
- Componentes e stores dependem apenas de `MenuSource`; a troca não altera UI.

### 6.6 Atualização de conteúdo (RF-11)

Fluxo do desenvolvedor: editar `assets/cardapios/*.md` ou trocar foto → commit → CI roda geração + fidelidade + testes → publicação. **Aprovação das alterações de cardápio pela empresa ocorre fora do repositório** (P-07); o repo não possui CMS, login ou painel.

---

## 7. Fluxo de orçamento e formulário (P-03, RF-07 a RF-08)

### 7.1 Etapas

| Etapa | Conteúdo | Regras |
|---|---|---|
| 1. **Seleção** | Revisão e ajuste da escolha (RF-07) | Lista por categoria com remover; ações “Continuar escolhendo” (para `/cardapios/:slug` ou `/montar`); **mínimo 1 item** para avançar (não exige item por categoria) |
| 2. **Dados** | Formulário do evento | Validação ao tentar avançar; erros **não perdem a seleção nem o já preenchido** (CA-06, CA-10) |
| 3. **Revisão** | Resumo em seções + avisos + ações | “Editar” por seção; **“Abrir WhatsApp”**; aviso de que a mensagem será enviada pelo cliente |

### 7.2 Campos e validações

| Campo | Especificação | Validação |
|---|---|---|
| Nome | Texto, obrigatório | trim não vazio; mensagem “Informe seu nome.” |
| Convidados | `type="text"` + `inputmode="numeric"`, ajuda “Uma estimativa é suficiente”, mínimo 1, **sem máximo arbitrário** | inteiro ≥ 1; rejeita 0, negativo, não numérico (CA-11) |
| Data | **Rádio com exatamente 3 opções** (CA-19): **Data definida** → `<input type="date">` (dia, mês e ano); **Mês aproximado** → seletores de mês e ano **apenas, sem campo de dia**; **Ainda não sei** → nenhum campo. **Nenhuma opção cria campos adicionais** | definida ≥ hoje; aproximada ≥ mês atual, validada **sem exigir dia**; **sem quinzena, intervalo ou período livre**; comparação por componentes locais (ano/mês/dia) para evitar erro de fuso (CA-12) |
| Local | **Rádio com 2 opções**: “Local definido” → cidade (obrigatória) + nome do espaço (opcional) + endereço (opcional); “Ainda não sei” → nenhum campo | cidade obrigatória apenas quando definido (CA-12) |
| Observações | Textarea opcional | Quinzena, período livre e pedidos especiais vão aqui — **não** em campos extras |

### 7.3 Estado

- `SelectionStore` e `QuoteFormStore` (signals, escopo de aplicatório) — **memória pura**.
- Proibido: `localStorage`, `sessionStorage`, cookies de dados pessoais, query params com dados de seleção/formulário (CA-18).
- **Comportamento no recarregamento — aviso obrigatório:** o estado permanece **exclusivamente em memória**, conforme o PRD (RB-10, CA-18); atualizar ou fechar a página reinicia o fluxo na etapa 1 com seleção vazia. Para que a perda seja esperada e não surpreendente, o TDD define um **aviso simples e compreensível**, em linguagem sem jargão, exibido em dois momentos:
  - **aviso visível no fluxo** (`NoticeComponent`), presente desde a etapa 1 até a revisão, com texto padrão: *“Sua seleção e o que você preencheu ficam apenas nesta página. Se você atualizar ou fechar a página, tudo será perdido — nada é salvo no navegador.”*;
  - **confirmação nativa do navegador** (`beforeunload`), acionada **apenas** quando há seleção ou dados preenchidos a perder, pedindo confirmação antes de atualizar ou fechar.

  Ao recarregar, a etapa 1 exibe os pontos de partida (escolher cardápio pronto ou montar seleção) e repete o aviso. Isso atende ao risco da §13 do PRD sem violar a privacidade.
- Transparência antes do envio: “Nenhum dado é enviado ao site ou salvo no navegador; tudo segue apenas para a mensagem do WhatsApp.”

### 7.4 Acessibilidade do formulário (CA-14)

- Grupos de rádio em `<fieldset>` com `<legend>`; labels sempre visíveis; erros ligados por `aria-describedby` + `aria-invalid`.
- Resumo de erros no topo da etapa, com âncoras para cada campo inválido.
- Ordem de tabulação lógica; foco movido para o primeiro campo inválido ao tentar avançar.
- Alvos de toque ≥ 44×44 px; texto 16–18 px; contraste ≥ 4,5:1; nada depende de hover.

---

## 8. Integração WhatsApp (P-02, RF-09, RF-10)

### 8.1 Composição

`WhatsAppService` em duas funções puras e unit-testáveis:

- `buildMessage(request: QuoteRequest): string`
- `buildUrl(number: string, message: string): string` → `https://wa.me/<numero>?text=<encodeURIComponent(message)}`

**Template em seções** (ordem fixa):

```
Olá! Gostaria de solicitar um orçamento para um evento.

Nome: <nome>
Convidados (aproximados): <n>
Data: <15/03/2027 | março de 2027 | ainda não definida>
Local: <Lages — nome do espaço/endereço | cidade | ainda não definido>

Origem: <Cardápio Italiano — todos os itens | Cardápio Italiano — versão personalizada | Seleção montada pelo cliente>

Itens:
<Categoria>
- <prato>
...

Observações: <texto, se houver>

Obs.: esta é uma solicitação de orçamento, não uma contratação. A
disponibilidade e o valor serão avaliados pela equipe do buffet.
```

- **Origem:** `pronto` → nome do cardápio + todos os itens; `personalizado` → nome do cardápio de origem + itens finais (RB-03, deixando claro que é versão personalizada); `montado` → itens **agrupados pelas categorias originais** (CA-04).
- Datas e locais nos **três/two estados** respectivos (CA-12); uso de `Intl` com `pt-BR`.
- Quebras de linha preservadas na codificação; caracteres acentuados testados (ç, ã, á).

### 8.2 Número e configuração

- `environment.whatsappNumber` — **configurável por ambiente, nunca hardcoded no componente** (CA-08).
- Valor placeholder identificado (`WHATSAPP_PENDENTE`) até o número oficial; **build de produção falha se o placeholder permanecer** (portão de publicação, seção 14.4).
- Nenhum número de teste fictício é publicado.

### 8.3 Fallback e avisos

- **Limite prático:** se a URL codificada ultrapassar **~2000 caracteres** (valor inicial, a validar em teste real conforme P-02), a tela exibe **“Copiar resumo”** (`navigator.clipboard.writeText`, com fallback de seleção manual em contexto não-seguro) e a opção **“Abrir WhatsApp sem texto”**.
- Aviso prévio obrigatório (RF-10): “Você será direcionado ao WhatsApp. A mensagem só será enviada se você confirmar o envio no aplicativo.”
- **Sem WhatsApp Business API**; sem envio automático; sem comprovação de entrega (RB-09).
- Abertura por âncora `<a href>` (botão do meio funciona); `rel="noopener"` ao abrir em nova aba.

### 8.4 Testes

- Unitários: 3 estados de data × 2 estados de local × 3 origens; codificação; limite de comprimento; ausência de preço em qualquer mensagem.
- E2E: href do `wa.me` correta sem navegar de fato (interceptação de rede/clique).
- Manual obrigatório na validação: **Android, iOS e desktop** (P-02).

---

## 9. SEO, metadados e dados estruturados (P-05, CA-16)

| Item | Implementação |
|---|---|
| Títulos/descrições | Únicos por rota, definidos via `Title`/`Meta` do Angular — **funcionam no prerender**, portanto presentes no HTML estático |
| Canonical | Nas páginas indexáveis, com `environment.baseUrl` |
| Sitemap | Gerado em build **somente com páginas indexáveis** (home, 3 cardápios, privacidade) |
| robots.txt | `Allow: /`, apontando o sitemap. **Sem `Disallow` em `/orcamento` e `/montar`** — bloquear crawl impediria o Google de ler o `noindex`; o controle é o meta `noindex` |
| Open Graph / Twitter Card | Por rota; imagem = derivado otimizado (1200×630) da fotografia aprovada |
| JSON-LD | `FoodEstablishment` na home + `Menu`/`MenuSection`/`MenuItem` nas páginas de cardápio. **Somente dados oficiais fornecidos**: sem telefone → campo ausente; sem endereço → `areaServed`; **nunca inventar** (RB-14). Versão inicial limita-se a nome + URL + dados dos cardápios, ampliando quando os dados de SEO local chegarem |
| `noindex` | `<meta name="robots" content="noindex">` em `/montar`, `/orcamento` e 404 (também no prerender desses shells) |

---

## 10. Imagens e desempenho (P-01, P-06, RF-02)

### 10.1 Pipeline de imagens

- `scripts/generate-images.ts` lê os originais de `assets/fotos/` (**nunca alterados**) e gera, em `public/img/`:
  - formatos **AVIF e WebP**, larguras 400/800/1200/1600 px;
  - **manifesto JSON** com dimensões de cada derivado (alimenta `width`/`height` → CLS ≈ 0);
  - otimização por qualidade até caber nos orçamentos: **destaque ≤ 200 KB** e **galeria ≤ 150 KB** no tamanho exibido.
- Uso no HTML: `srcset` + `sizes` + dimensões explícitas; **lazy loading fora da primeira dobra**; apenas a imagem da home recebe prioridade (LCP).
- Os PNG originais (2,49–3,07 MB) **não entram na saída do build**.

### 10.2 Metas e medição

| Métrica | Meta |
|---|---|
| LCP / INP / CLS (móvel) | ≤ 2,5 s / ≤ 200 ms / ≤ 0,1 |
| Lighthouse móvil | Performance ≥ 90, Acessibilidade ≥ 95, SEO ≥ 90 |
| Orçamento de JS | Fixado **após** primeira medição com Lighthouse CI + dispositivo real (P-06) |

- **Lighthouse CI** no pipeline (falha o CI abaixo dos orçamentos).
- Fontes: **self-hosted com subconjunto e `font-display: swap`**; tipografia final depende da identidade visual (P-08) — a implementação já prevê o pipeline de self-hosting.
- Estratégia de cache na hospedagem (seção 14).

---

## 11. Acessibilidade (P-06, CA-14)

- **Meta: WCAG 2.2 AA.**
- Estrutura semântica: landmarks (`header`/`nav`/`main`/`footer`), hierarquia de títulos sem saltos, skip link.
- Teclado: tudo operável por tabulação, foco sempre visível (anel com contraste ≥ 3:1), sem armadilhas de foco, gestão de foco em trocas de rota e de etapa.
- Formulários: rótulos, ajuda, erros claros em linguagem simples (público com pouca familiaridade tecnológica), resumo de erros navegável.
- Movimento: `prefers-reduced-motion` respeitado; sem animação excessiva, sem timeout, sem informação só em hover.
- Contraste ≥ 4,5:1; alvos ≥ 44×44 px; texto entre 16 e 18 px.
- Validação automatizada com **axe-core** (E2E) + passada manual com teclado e leitor de tela antes da validação com o responsável (CA-14).

---

## 12. Estratégia de testes

| Nível | Ferramenta | Escopo |
|---|---|---|
| **Unitário** | Vitest quando suportado pela versão Angular escolhida; senão Karma/Jasmine (padrão). Definir na inicialização | `buildMessage` (3 datas × 2 locais × 3 origens), `buildUrl` e codificação, validadores (data passada, convidados, obrigatoriedades), stores (adicionar/remover, mínimo 1 item, preservação de origem), chave de dedup, formatação `pt-BR` |
| **Fidelidade de conteúdo** | Specs que rodam o parser real | Seção 6.3 inteira — falham o build |
| **E2E** | **Playwright** | Jornadas: (a) cardápio pronto, (b) personalizado com pratos de outro cardápio, (c) seleção montada; paridade de campos entre os três caminhos (CA-05); validação sem perda de seleção (CA-06); aviso de perda ao recarregamento (§7.3); href `wa.me` (CA-02…CA-04); `noindex` (CA-16); HTML pré-renderizado legível **sem JavaScript**; percorrer o fluxo só por teclado |
| **Acessibilidade** | axe-core no Playwright | Sem violações críticas/serias em todas as rotas; contraste; nomes acessíveis |
| **Desempenho** | Lighthouse CI + dispositivo real | Orçamentos 90/95/90 e Core Web Vitals (seção 10.2) |
| **Manual (validação)** | — | WhatsApp em Android/iOS/desktop; leitor de tela; recarregamento; limite de comprimento da mensagem; responsividade em celular/tablet/desktop |

**Ausências verificadas por teste:** nenhum campo de preço/cálculo (CA-17), nenhum uso de `localStorage`/`sessionStorage`/cookies (CA-18 — asserção de API ausente + ausência de gravação), nenhuma chamada HTTP no bundle (CA-09).

---

## 13. Matriz de rastreabilidade (requisito → desenho → teste)

| Req. | Desenho | Teste principal |
|---|---|---|
| RF-01 | §4.1, §4.3, §5 | E2E home + axe |
| RF-02 | §10.1, §9 | Fidelidade de imagens + inspeção + Lighthouse |
| RF-03 | §6 | Fidelidade estrutural: nomes, categorias e ordem; contagens derivadas dos arquivos (§6.3a) |
| RF-04 | §7.1 etapa 1, §8.1 | E2E jornada “pronto” + `buildMessage` |
| RF-05 | §4.3 (`/montar` com base), §8.1 | E2E jornada “personalizado” |
| RF-06 | §6.4, §4.3 | Unit dedup (catálogo calculado dos arquivos) + E2E “montado” |
| RF-07 | §7.1 etapa 1 | E2E revisão/ajuste |
| RF-08 | §7.2 | Unit validadores + E2E formulário |
| RF-09 | §8.1, §8.2 | Unit mensagem/URL + E2E href |
| RF-10 | §8.3, `NoticeComponent` | E2E avisos + revisão de conteúdo |
| RF-11 | §6.6, §14.2 | Pipeline CI (geração + fidelidade) |
| CA-01 | §5, §12 | E2E responsivo |
| CA-02…04 | §8.1 | Unit por origem + E2E |
| CA-05 | §7 | E2E paridade de campos |
| CA-06 | §7.1, §7.3 | E2E validação sem perda |
| CA-07 | §8.1, revisão de conteúdo | E2E + checklist de texto |
| CA-08 | §8.2 | Portão de build (§14.4) |
| CA-09 | §2.2, §15 | Asserção de ausência de chamadas HTTP |
| CA-10/11 | §7.2 | Unit + E2E |
| CA-12 | §8.1 | Unit 3 datas × 2 locais |
| CA-13 | §10.1, P-01 | Fidelidade + inspeção manual |
| CA-14 | §11 | axe + manual teclado/leitor |
| CA-15 | §10.2 | Lighthouse CI |
| CA-16 | §9 | E2E HTML sem JS + Lighthouse SEO |
| CA-17 | §3, §8 | Unit (mensagem sem preço) + revisão |
| CA-18 | §7.3 | E2E (sem storage) + asserção de APIs ausentes |
| CA-19 | §7.2 | Unit + E2E (schema do formulário) |

---

## 14. Hospedagem e CI/CD (P-05)

### 14.1 Provedor (decisão pendente — custo/conta existente)

| Provedor | Quando preferir | Observação |
|---|---|---|
| **Azure Static Web Apps** | Se a futura API .NET for hospedada no Azure | Preferência registrada em P-05 |
| **Cloudflare Pages** | Alternativa de baixo custo e boa performance no Brasil | Configuração de headers via arquivo próprio |
| **Netlify / Vercel** | Alternativas maduras | Observar custo e região |

Requisitos mínimos em qualquer escolha: **estático + CDN, HTTPS, domínio próprio**, cache e redirects.

### 14.2 Pipeline (GitHub Actions)

1. `npm ci` → lint → unit tests
2. `npm run generate` (cardápios + imagens + rotas) → **testes de fidelidade**
3. `ng build` (prerender) → asserções de HTML estático (título, canonical, `noindex`, JSON-LD)
4. E2E (Playwright) → axe
5. Lighthouse CI (orçamentos)
6. Deploy: **preview** para PR; **produção** na branch principal

### 14.3 Headers e cache

| Recurso | Cache |
|---|---|
| Assets com hash (JS/CSS/imagens) | `public, max-age=31536000, immutable` |
| `index.html`, `sitemap.xml`, `robots.txt` | `no-cache` (revalidação) |

Segurança: CSP restritiva (sem inline desnecessário; navegação para `wa.me` permitida), `Referrer-Policy`, `X-Content-Type-Options`, `Permissions-Policy` mínima, HSTS (fornecido pela plataforma).

### 14.4 Portões de publicação (build de produção falha se…)

1. `whatsappNumber` ainda for placeholder (CA-08).
2. `baseUrl` ausente (canonical/sitemap/OG inválidos).
3. Qualquer teste de fidelidade falhar.
4. Dados de SEO local/autorizações de imagem pendentes — **bloqueiam publicação real**, mesmo que o build técnico passe (seção 18).

---

## 15. Integração futura com API .NET (prevista, **não implementada**)

O que fica pronto **agora** sem implementar a API:

- **`MenuSource`** como fronteira única de troca de fonte de conteúdo (seção 6.5).
- **`apiBaseUrl`** presente em `environment.ts`, reservado e **sem nenhuma chamada** (sem `HttpClient` em produção).
- Modelos de domínio em `core/models`, independentes de interface e de origem.
- Esta seção documenta o caminho de evolução; **nada aqui autoriza** antecipar estoque, reservas, login, painel ou dados da Etapa 2 (regras de fronteira do PRD §1).

---

## 16. Decisões técnicas registradas nesta proposta

### 16.1 `/montar` unifica RF-05 e RF-06
Uma rota atende “personalizar cardápio existente” (com base carregada no `SelectionStore`) e “montar do zero”, evitando rota extra e perda de estado. **Aprovado na proposta técnica.**

### 16.2 Indexação além do mínimo do PRD — **aprovada na v0.2**
PRD: indexar home e cardápios; `noindex` no fluxo de orçamento. O TDD aplica `noindex` também em `/montar` (faz parte do funil) e mantém `/politica-de-privacidade` **indexável**. **Aprovada pelo responsável na revisão da v0.2:** política de privacidade poderá ser indexada; `/montar` e `/orcamento` permanecem com `noindex`.

### 16.3 Limite prático da URL do WhatsApp
~2000 caracteres como valor inicial do fallback, validado em teste real (P-02) e ajustável por configuração.

### 16.4 Artefatos gerados fora do versionamento
`src/app/content/` e `public/img/` são gerados em build e gitignored; fonte única são os originais em `assets/`.

### 16.5 Nome deste documento
`docs/06-tdd.md`, seguindo a numeração 01–05.

---

## 17. Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Lista de rotas prerender não atualizada com cardápio novo | Geração automática + teste que falha o build (§5, §6.3) |
| Markdown fora do formato após edição | Parser estrito + falha de build + testes de fidelidade (§6) |
| Seleção longa excede limite prático da URL | Fallback “Copiar resumo” + “Abrir WhatsApp sem texto” (§8.3) |
| Recarregamento perde seleção/formulário (aceito pelo PRD) | Fluxo curto, aviso visível permanente + confirmação nativa antes de atualizar/fechar (§7.3) e pontos de partida claros na etapa 1 |
| Imagens originais pesadas prejudicarem LCP | Pipeline de derivados com orçamentos de KB + Lighthouse CI (§10) |
| `mesa-richots.png` sem autorização de imagem | Portão de publicação (§18); sem autorização, uso restrito a protótipo interno (P-01) |
| Número/dados oficiais ausentes | Portões de build e de publicação; placeholder nunca é publicado (§8.2, §14.4) |
| Comparação de data com erro de fuso | Validação por componentes locais de data, com teste na virada do dia (§7.2) |
| Clipboard bloqueado em contexto não-seguro | Fallback de cópia manual com instrução (§8.3) |
| Versão Angular/Node mudar antes da implementação | Fixar versões exatas na inicialização e registrar na §2.1 |
| Escopo da Etapa 2 vazar para a Etapa 1 | Seção 15 + asserções de ausência de API/backend (§12) |

---

## 18. Pendências que bloqueiam **publicação** (não a aprovação deste TDD)

Conforme PRD §11:

- Número oficial do WhatsApp e decisão de exibição pública.
- Domínio próprio, `baseUrl` e provedor de hospedagem.
- Dados oficiais de SEO local (cidade/região, endereço ou área de atendimento, telefone, horários, redes sociais, Google Business Profile).
- Autorização de uso das três fotografias e de imagem das pessoas em `mesa-richots.png` (ou recorte/desfoque aprovado); créditos, legendas e textos alternativos definitivos.
- Textos institucionais, rodapé e política de privacidade (P-08).
- Identidade visual e fontes (P-08).
- Analytics (P-09) — qualquer ferramenta deve respeitar a não persistência de dados pessoais.
- Avaliação com usuários (P-10) — plano a definir.

---

## 19. Próximos passos (após aprovação deste TDD)

1. Aprovação definitiva do TDD pelo responsável (a §16.2 já foi aprovada na v0.2).
2. **Inicializar o OpenSpec** e especificar as mudanças da Etapa 1.
3. Implementar em fatias pequenas, nesta ordem sugerida: projeto base e rotas → pipeline de cardápios + fidelidade → páginas de cardápio e home → imagens e SEO → `/montar` → `/orcamento` e mensagem → acessibilidade, E2E e Lighthouse.
4. Validar em navegador mobile e desktop (WhatsApp, campos, acessibilidade) e concluir a validação da Etapa 1 com o responsável (PRD §12).

---

## 20. Histórico de versões

- **0.1** — versão inicial: arquitetura Angular, componentes, rotas e prerender, pipeline Markdown, formulário de orçamento, WhatsApp, SEO, testes, hospedagem, ponte para API .NET, matriz de rastreabilidade e riscos; proposta aprovada pelo responsável antes da escrita.
- **0.2** — revisão após aprovação da estrutura técnica, com quatro ajustes solicitados: (1) **datas** mantidas em exatamente três estados — definida (dia, mês e ano), aproximada (somente mês e ano, **sem exigir dia**) e “ainda não sei”, sem campos adicionais (§7.2); (2) **recarregamento** com estado exclusivamente em memória, conforme o PRD, e aviso simples e compreensível sobre a perda da seleção — texto visível permanente no fluxo e confirmação nativa antes de atualizar/fechar (§7.3); (3) **§16.2 aprovada**: política de privacidade indexada, `/montar` e `/orcamento` permanecendo com `noindex` (§5, §16.2); (4) **testes de fidelidade** com validação estrutural derivada dos próprios arquivos Markdown (contagens, nomes e ordem calculados em tempo de teste) e contagens atuais — 10/15/8, 33 ocorrências, 26 pratos únicos — registradas apenas como referência documental inicial da primeira implementação, não como asserção permanente (§6.3). Nenhuma alteração de requisitos do PRD.
