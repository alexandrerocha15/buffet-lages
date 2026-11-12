# PRD — Etapa 1: Site Buffet Lages

**Versão:** 0.4 — decisões P-01 a P-07 consolidadas; PRD aprovado como base de requisitos; pendências de dados e publicação registradas.
**Produto deste PRD:** site público institucional e comercial do Buffet Lages (Etapa 1), desenvolvido em Angular.
**Contexto:** Trabalho de Conclusão de Curso (TCC) organizado em duas etapas.
**Prazo estimado do TCC:** dezembro de 2026 ou início de 2027, ainda não confirmado.
**Prioridade:** concluir e validar a Etapa 1 antes de iniciar a Etapa 2.
**TDD:** Technical Design Document (documento de design técnico), a ser produzido somente após a aprovação deste PRD.
**Conteúdo real:** três cardápios em `assets/cardapios/` e três fotografias em `assets/fotos/`.

## 1. Decisão de roadmap

O projeto passa a ser organizado em duas etapas, com prioridade para a primeira.

### Etapa 1 — Site institucional e comercial

Site público do Buffet Lages, em Angular, para apresentar a empresa, mostrar fotografias reais, exibir os três cardápios disponíveis, permitir a escolha, personalização ou montagem de uma seleção de pratos e encaminhar solicitações de orçamento pelo WhatsApp.

A Etapa 1 deve ser concluída e validada com o responsável pelo buffet antes de qualquer implementação da Etapa 2.

### Etapa 2 — Sistema de gestão de locações de materiais para eventos

Sistema inspirado nas necessidades reais da empresa e no modelo de negócio da Stock Now, com possibilidade futura de comercialização para outras empresas. As ideias preservadas incluem, sem compromisso de escopo ou ordem:

- catálogo de materiais com fotos, quantidades de referência, preço unitário e seleção em uma “caixa”;
- solicitação de locação pelo WhatsApp, inicialmente sem bloquear estoque nem confirmar disponibilidade automaticamente;
- reservas por período, disponibilidade, separação, retirada, devolução, avarias e estoque;
- controle operacional e painel administrativo adaptado a dispositivos móveis;
- integração via API entre o site e o sistema de gestão;
- comercialização para outras empresas, se houver validação de mercado.

A Etapa 2 será objeto de PRD, TDD e specs próprios. Nada nesta seção autoriza antecipar funcionalidades dela na Etapa 1.

### Regras de fronteira

- A Etapa 1 é a prioridade atual e não deve ser bloqueada por decisões da Etapa 2.
- A Etapa 1 deve funcionar de forma independente da Etapa 2, sem exigir banco de dados, login, API ou painel administrativo.
- As ideias da Etapa 2 não foram descartadas; ficam registradas para a evolução do TCC.
- A referência à Stock Now é de categoria e modelo de negócio. Não implica copiar código, marca, identidade visual, conteúdo ou operação.
- A nomenclatura anterior de Etapas A, B e C fica substituída, neste PRD, por Etapa 1 e Etapa 2. As ideias das antigas Etapas B e C são preservadas na Etapa 2.

## 2. Problema, público e proposta de valor

**Problema:** o Buffet Lages precisa apresentar seu trabalho de forma profissional na web e transformar interesse em contatos comerciais com contexto suficiente para iniciar um orçamento. A operação atual é baseada em atendimento humano e negociação personalizada.

**Público:** pessoas que organizam casamentos, formaturas, aniversários e outros eventos e desejam conhecer o buffet e solicitar uma proposta, incluindo adultos com pouca familiaridade com tecnologia.

**Proposta de valor:** mostrar a experiência e a oferta do buffet; permitir escolher um cardápio de referência, personalizá-lo ou criar uma seleção; encaminhar uma solicitação organizada para conversa comercial via WhatsApp.

**Objetivo do MVP da Etapa 1:** permitir conhecer o buffet e solicitar orçamento por WhatsApp, a partir de um cardápio pronto, de um cardápio personalizado ou de uma seleção de pratos, sem cálculo automático de preço, reserva ou contratação.

## 3. Jornada principal

1. Visitar a página institucional e conhecer os serviços.
2. Ver as fotografias reais e os três cardápios disponíveis.
3. Escolher um cardápio pronto, personalizá-lo ou montar uma seleção de pratos.
4. Informar nome, quantidade aproximada de convidados, data (definida, aproximada ou ainda não sei), local (definido ou ainda não sei) e observações.
5. Revisar o resumo da solicitação.
6. Abrir o WhatsApp com a mensagem preparada e enviá-la pelo próprio aplicativo.
7. Prosseguir a negociação diretamente com o buffet.

## 4. Conteúdo real disponível

### 4.1 Cardápios

| Cardápio | Categorias preservadas | Itens | Observações |
|---|---|---|---|
| `assets/cardapios/italiano.md` — Cardápio Italiano | Carnes (2); Massas e acompanhamentos (4); Saladas (4) | 10 | Sem sobremesas, bebidas ou preços |
| `assets/cardapios/churrasco.md` — Cardápio Churrasco | Carnes (4); Massas e acompanhamentos (5); Saladas (6) | 15 | Sem sobremesas, bebidas ou preços |
| `assets/cardapios/contemporaneo.md` — Cardápio Contemporâneo | Pratos principais (4); Saladas (4) | 8 | Sem sobremesas, bebidas ou preços |

São 33 ocorrências de pratos. Alguns pratos aparecem em mais de um cardápio, como maionese, carpaccio de frutas, pernil suíno, galeto e espaguete. Também existem pequenas variações de nome, como “Carpaccio de frutas” e “Carpaccio de frutas frescas”.

As categorias dos arquivos originais serão preservadas exatamente como estão. Não haverá categoria de sobremesas nesta versão, porque não há conteúdo real fornecido. Bebidas, preços, quantidades, ingredientes e descrições também não serão inventados.

### 4.2 Fotografias

| Arquivo | Dimensão | Tamanho | Conteúdo visível | Uso proposto |
|---|---|---|---|---|
| `assets/fotos/mesa-frios.png` | 1448×1086 | 3,07 MB | Mesa de frios com canapés, queijos, embutidos, azeitonas e pães | Material institucional, galeria e possível destaque visual |
| `assets/fotos/mesa-frutas-saladas.png` | 1086×1448 | 2,72 MB | Saladas, frutas e arranjos florais | Material institucional, galeria e seção de saladas e frescor |
| `assets/fotos/mesa-richots.png` | 1448×1086 | 2,49 MB | Rechauds com pratos quentes; pessoas ao fundo | Material institucional, galeria e apresentação do buffet quente |

As três fotografias são reais e serão usadas como material institucional e de apresentação. Elas não serão vinculadas obrigatoriamente a cardápios específicos. Nenhuma imagem genérica deve representar pratos ou eventos reais quando houver material próprio.

A fotografia `mesa-richots.png` contém pessoas ao fundo. O uso exige confirmação de autorização de imagem ou recorte/desfoque. Textos alternativos, legendas, créditos e eventuais recortes ainda precisam ser aprovados.

### 4.3 Conteúdo e dados ainda não disponíveis

- Sobremesas — removidas do escopo atual.
- Bebidas.
- Preços ou faixas de referência.
- Quantidades, porções ou rendimento.
- Ingredientes e descrições dos pratos.
- Textos institucionais finais, rodapé e políticas.
- Autorização, créditos e legendas definitivas das fotografias.
- Dados oficiais de SEO local: cidade/região, endereço ou área de atendimento, telefone, horários e redes sociais.
- Número oficial do WhatsApp e domínio próprio.

### 4.4 Regras de conteúdo

- Os arquivos Markdown são fontes editoriais, não páginas a serem exibidas literalmente.
- O site deve renderizar componentes estruturados de cardápio, com seções e itens.
- Os arquivos originais são somente leitura e não serão alterados.
- Qualquer normalização ocorrerá em uma camada derivada, com preservação dos nomes e das categorias.
- A conversão dos Markdown em dados estruturados ocorrerá em tempo de build, com validação de schema e testes de fidelidade; não haverá parsing de Markdown em runtime.
- Pratos repetidos serão unificados apenas no catálogo de seleção; os cardápios originais manterão suas listas completas.
- Variações de nome serão preservadas até confirmação do responsável.
- Nenhum prato, preço, ingrediente, quantidade ou serviço será inventado.
- Não haverá exibição de preços ou cálculos automáticos nesta versão.

## 5. Escopo da Etapa 1

### Dentro do escopo

- Página inicial responsiva, em Angular, com identidade, navegação e chamada para orçamento.
- Uso das três fotografias reais como material institucional e de apresentação.
- Apresentação dos três cardápios reais, com suas categorias e itens.
- Escolha de um cardápio pronto.
- Personalização de um cardápio, com inclusão de pratos dos demais cardápios e remoção de itens.
- Montagem de uma seleção de pratos a partir do catálogo unificado.
- Revisão e ajuste da seleção antes do envio.
- Formulário com nome obrigatório; quantidade aproximada de convidados obrigatória; data definida (dia, mês e ano), aproximada (mês e ano) ou ainda não sei; local com cidade obrigatória quando definido, nome do espaço ou endereço opcionais e opção “ainda não sei”; observações opcionais.
- Geração de mensagem legível e abertura do WhatsApp comercial.
- Comunicação clara de que o cliente envia a mensagem e que o orçamento não é contratação.
- Atualização de conteúdo pelo desenvolvedor via projeto e republicação.
- SEO local, acessibilidade, desempenho e experiência simplificada para o público-alvo.

### Fora do escopo da Etapa 1

- Sobremesas e bebidas, enquanto não houver conteúdo real aprovado.
- Preços, faixas de preço, cálculo automático ou simulação de valores.
- Catálogo de locação de materiais, disponibilidade de estoque, reservas, retirada, devolução e avarias.
- Checkout, pagamentos, emissão de notas fiscais, CRM, painel administrativo e login.
- Backend, banco de dados ou API de integração implementados.
- Sistema de gestão de locações da Etapa 2 e comercialização para terceiros.
- Armazenamento de dados pessoais no navegador.
- Imagens genéricas usadas para representar pratos ou eventos reais.

Esses itens não foram descartados. Eles pertencem à Etapa 2, dependem de conteúdo futuro ou de decisão específica, e não devem ser antecipados na Etapa 1.

## 6. Requisitos funcionais propostos

| ID | Requisito | Prioridade |
|---|---|---|
| RF-01 | Página inicial responsiva, em Angular, com navegação, identidade da empresa e chamada para orçamento | Essencial |
| RF-02 | Usar as três fotografias reais como material institucional e de apresentação, com textos alternativos e legendas aprovados; não usar imagem genérica para representar prato ou evento real | Essencial |
| RF-03 | Apresentar os três cardápios reais — Italiano, Churrasco e Contemporâneo — com suas categorias e itens originais, sem preços ou dados não fornecidos | Essencial |
| RF-04 | Permitir escolher um cardápio pronto e solicitar orçamento com todos os itens | Essencial |
| RF-05 | Permitir personalizar um cardápio, adicionando pratos dos demais cardápios e removendo itens, mantendo o cardápio de origem como referência | Essencial |
| RF-06 | Permitir montar uma seleção de pratos a partir de um catálogo unificado, com as categorias originais e pratos repetidos unificados apenas nesse catálogo | Essencial |
| RF-07 | Permitir revisar e ajustar a seleção antes do envio | Essencial |
| RF-08 | Oferecer formulário com nome obrigatório; quantidade aproximada de convidados obrigatória; data com exatamente três opções — definida (dia, mês e ano), aproximada (mês e ano) ou ainda não sei; local com cidade obrigatória quando definido, nome do espaço ou endereço opcionais e opção “ainda não sei”; observações opcionais | Essencial |
| RF-09 | Gerar mensagem legível com nome, dados do evento, origem da seleção e itens, e abrir o WhatsApp comercial | Essencial |
| RF-10 | Informar que a mensagem precisa ser enviada pelo cliente no WhatsApp e que orçamento não é contratação | Essencial |
| RF-11 | Permitir ao desenvolvedor atualizar cardápios, fotografias e textos via projeto e republicação | Essencial |

## 7. Regras de negócio propostas

- RB-01: cardápios são referências e não implicam aceitação automática de contrato.
- RB-02: o cliente pode escolher um cardápio pronto, personalizá-lo ou montar uma seleção de pratos.
- RB-03: a personalização pode incluir pratos dos demais cardápios; a mensagem deve identificar o cardápio de origem e os itens finais, deixando claro que se trata de uma versão personalizada.
- RB-04: as categorias dos cardápios originais serão preservadas; não haverá categoria de sobremesas nesta versão.
- RB-05: pratos repetidos serão unificados apenas no catálogo de seleção; os cardápios originais manterão suas listas e repetições.
- RB-06: nome é obrigatório; a quantidade aproximada de convidados é obrigatória e não exige precisão absoluta; a data tem exatamente três estados — definida com dia, mês e ano, aproximada com mês e ano, ou ainda não sei; o local, quando definido, exige cidade e aceita nome do espaço ou endereço opcionais, ou pode ser “ainda não sei”; observações são opcionais. Não haverá campos de quinzena, intervalo ou período livre para a data.
- RB-07: não há exibição de preços, cálculo automático, reserva, pagamento ou confirmação de disponibilidade.
- RB-08: a empresa avalia disponibilidade, logística e valor após receber a mensagem.
- RB-09: o botão de WhatsApp apenas abre uma conversa com texto pré-preenchido; o envio depende do cliente e não há comprovação automática de entrega.
- RB-10: não há backend, login, banco de dados ou armazenamento de dados pessoais no navegador nesta versão.
- RB-11: a existência futura da Etapa 2 não autoriza a Etapa 1 a prometer disponibilidade, reserva, estoque ou contratação.
- RB-12: as fotografias são material institucional e não precisam estar vinculadas a cardápios específicos; imagens genéricas não podem representar pratos ou eventos reais.
- RB-13: os cardápios originais são somente leitura; correções de nomes ou variações dependem de aprovação do responsável.
- RB-14: nenhum prato, preço, ingrediente, quantidade ou serviço será inventado.

## 8. Critérios de aceite iniciais

A detalhar no TDD e nos specs antes da implementação.

- CA-01: em celular e desktop, o visitante encontra os cardápios e a ação de orçamento.
- CA-02: selecionar um cardápio pronto produz mensagem identificando o cardápio e seus itens.
- CA-03: personalizar um cardápio produz mensagem identificando o cardápio de origem e os itens finais, inclusive pratos adicionados de outros cardápios.
- CA-04: montar uma seleção produz mensagem com os itens agrupados pelas categorias originais, com pratos repetidos unificados apenas no catálogo.
- CA-05: os três caminhos oferecem os mesmos campos, permitem revisão antes do WhatsApp e aceitam “ainda não sei” para data e local.
- CA-06: campos inválidos ou ausentes são tratados sem perda inesperada da seleção.
- CA-07: não há afirmação enganosa de reserva, disponibilidade ou orçamento confirmado.
- CA-08: o número de WhatsApp é configurável e não deve ser inventado ou embutido como dado privado de teste.
- CA-09: a Etapa 1 funciona sem o sistema da Etapa 2, sem banco de dados, sem login e sem API.
- CA-10: nome vazio impede o envio, com mensagem clara e sem perder a seleção.
- CA-11: quantidade aproximada de convidados é obrigatória, aceita estimativa e não exige precisão absoluta.
- CA-12: a mensagem representa corretamente data definida (dia, mês e ano), data aproximada (mês e ano) ou “ainda não sei”; local definido com cidade e nome do espaço/endereço opcionais ou “ainda não sei”.
- CA-13: as três fotografias reais aparecem com texto alternativo aprovado; nenhuma imagem genérica representa prato ou evento real; não há vínculo obrigatório com cardápios.
- CA-14: o fluxo funciona por teclado e leitor de tela, sem depender de hover, e é compreensível para adultos com pouca familiaridade tecnológica.
- CA-15: o site atende às metas de desempenho aprovadas em teste móvel.
- CA-16: a estratégia de renderização aprovada entrega metadados de SEO local e dados estruturados aprovados, indexáveis.
- CA-17: não há exibição de preços ou cálculos automáticos.
- CA-18: nenhum dado pessoal é armazenado no navegador; a seleção e o formulário permanecem apenas em memória até a abertura do WhatsApp.
- CA-19: o formulário não oferece campos de quinzena, intervalo ou período livre para a data.

## 9. Requisitos não funcionais preliminares

- Frontend em **Angular**, com versão e organização definidas no TDD.
- Experiência **mobile-first**, com layouts testados em celular, tablet e desktop.
- **Acessibilidade:** meta WCAG 2.2 AA, texto entre 16 e 18 px, contraste mínimo de 4,5:1, alvos de toque de pelo menos 44×44 px, foco visível, rótulos, mensagens de erro claras e navegação por teclado.
- **Simplicidade para o público-alvo:** linguagem sem jargão, uma ação principal por etapa, sem gestos complexos, sem carrossel automático e com revisão antes do WhatsApp.
- **Desempenho:** meta móvel de LCP ≤ 2,5 s, INP ≤ 200 ms e CLS ≤ 0,1; Lighthouse móvel com Performance ≥ 90, Acessibilidade ≥ 95 e SEO ≥ 90; imagens responsivas em WebP/AVIF, `srcset`, dimensões explícitas e carregamento preguiçoso fora da primeira dobra.
- **SEO local:** pré-renderização em build das páginas institucionais e de cardápio; títulos e descrições únicos, canonical, sitemap, robots, Open Graph e dados estruturados de negócio local com informações oficiais.
- **Hospedagem:** hospedagem estática com CDN, HTTPS e domínio próprio; sem SSR em runtime; provedor a definir.
- **Conteúdo:** Markdown como fonte editorial, conversão em tempo de build para dados tipados, validação de schema e testes de fidelidade; nenhum parsing de Markdown em runtime e nenhuma edição nos originais.
- **Integrações futuras:** modelos de conteúdo e domínio separados da interface, com fonte de dados substituível no futuro; nenhuma API, estoque ou locação implementados agora.
- **Privacidade:** nome e dados do evento não são enviados a servidor próprio e não são armazenados no navegador; seguem apenas para a mensagem do WhatsApp.
- **Navegadores:** duas últimas versões dos principais navegadores móveis e desktop, a detalhar no TDD.

## 10. Decisões consolidadas (P-01 a P-07)

As decisões abaixo foram aprovadas e passam a integrar a base de requisitos do projeto. Onde há dados ainda não fornecidos pela empresa, a decisão registra a regra e mantém o dado como pendência, sem inventar informação.

### P-01 — Fotografias: autorização, uso e otimização

**Decisões de negócio**

- As três fotografias reais serão usadas como material institucional e de apresentação, sem vínculo obrigatório com cardápios específicos.
- O uso em produção depende de autorização de uso das imagens e, para `mesa-richots.png`, de autorização de imagem das pessoas ao fundo ou de recorte/desfoque aprovado.
- Créditos de fotógrafo, legendas e textos alternativos serão aprovados antes da publicação.
- Sem autorização, as imagens ficam restritas a protótipo interno.

**Decisões de implementação**

- `mesa-frios.png` como possível destaque principal; `mesa-frutas-saladas.png` na seção de saladas e frescor; `mesa-richots.png` na apresentação do buffet quente ou na galeria.
- Textos alternativos descritivos e sem repetição de palavras-chave; legendas neutras, sem afirmar que a imagem representa um cardápio específico.
- Originais preservados; derivados otimizados em WebP/AVIF, com `srcset`, `sizes`, dimensões explícitas e carregamento preguiçoso fora da primeira dobra.

### P-02 — WhatsApp: número, mensagem e fallback

**Decisões de negócio**

- O WhatsApp permanece o canal de solicitação de orçamento, com envio realizado pelo próprio cliente.
- O número oficial, o tom da mensagem e a exibição pública do número serão confirmados pela empresa.
- A mensagem deve deixar claro que se trata de solicitação de orçamento, não de contratação.

**Decisões de implementação**

- Link no formato `https://wa.me/<numero>?text=<mensagem>`, com número configurável por ambiente e sem hardcode no componente.
- Template em seções legíveis: saudação, nome, convidados, data, local, origem da solicitação, itens, observações e aviso de que é solicitação de orçamento.
- Codificação com `encodeURIComponent`, preservação de quebras de linha e teste em Android, iOS e desktop.
- Aviso de que o cliente será direcionado ao WhatsApp e de que a mensagem só será enviada se ele confirmar no aplicativo.
- Fallback “Copiar resumo” e abertura do WhatsApp sem texto quando a URL ultrapassar um limite prático validado em teste.
- Não usar WhatsApp Business API nesta versão.

### P-03 — Formulário e seleção

**Decisões de negócio**

- Nome obrigatório; quantidade aproximada de convidados obrigatória; observações opcionais.
- A data do evento tem exatamente três estados:
  - **Data definida:** dia, mês e ano.
  - **Data aproximada:** apenas mês e ano.
  - **Ainda não sei:** nenhum preenchimento de data.
- Não haverá campos de quinzena, intervalo ou período livre para a data.
- O local tem dois estados:
  - **Local definido:** cidade obrigatória; nome do espaço ou endereço opcionais.
  - **Ainda não sei:** nenhum preenchimento de local.
- Critério mínimo da seleção: pelo menos 1 item no total; não é exigido item por categoria.
- Datas passadas não serão aceitas.

**Decisões de implementação**

- Data definida: seletor de data nativo, com validação de data não passada. Data aproximada: seleção de mês e ano. “Ainda não sei”: nenhum campo de data.
- Local definido: cidade obrigatória e campo livre opcional para nome do espaço ou endereço. “Ainda não sei”: nenhum campo de local.
- Convidados: número inteiro positivo, com `inputmode="numeric"`, mínimo 1 e sem máximo arbitrário; texto de ajuda “Uma estimativa é suficiente”.
- Seleção por checkboxes ou cartões com estado selecionado claro; sem drag-and-drop.
- Resumo em seções, com ações “Editar” e “Abrir WhatsApp”.
- Estado apenas em memória; sem `localStorage`, `sessionStorage` ou cookies de dados pessoais.

### P-04 — Arquitetura de informação e UX

**Decisões de negócio**

- Nomes de navegação, chamadas para ação e conteúdo do rodapé serão aprovados pela empresa.
- O wireframe da jornada será revisado com o responsável pelo buffet antes da implementação.

**Decisões de implementação**

| Rota | Função |
|---|---|
| `/` | Home institucional: destaque, sobre, fotos, resumo dos cardápios, como funciona e chamada para orçamento |
| `/cardapios/:slug` | Página dedicada de cada cardápio, com categorias e itens |
| `/montar` | Montagem de seleção personalizada |
| `/orcamento` | Fluxo de solicitação em três etapas: seleção, dados e revisão |
| `/politica-de-privacidade` | Política e aviso de privacidade |

- Cardápios em página dedicada, não em modal; modal apenas para ampliar foto, se necessário.
- Fluxo de orçamento em uma única rota, com três etapas e estado em memória; evitar múltiplas rotas que possam perder a seleção ao recarregar.
- Navegação simples, com skip link, foco visível e menu mobile acessível.
- Chamada persistente “Solicitar orçamento”.
- `noindex` no fluxo de orçamento; indexar a home e as páginas de cardápio.
- Sem carrossel automático, sem gestos complexos e sem drag-and-drop.

### P-05 — SEO local, hospedagem e renderização

**Decisões de negócio**

- A empresa deve fornecer cidade/região de atuação, endereço público ou área de atendimento, telefone, horários, redes sociais e domínio próprio.
- Provedor de hospedagem e existência de perfil no Google Business Profile serão confirmados conforme custo e conta existente.

**Decisões de implementação**

- Pré-renderizar em build as páginas institucionais e de cardápio; manter o fluxo de orçamento no cliente; sem SSR em runtime.
- Hospedagem estática com CDN, HTTPS, domínio próprio, cache e redirects.
- Títulos e descrições únicos por rota, canonical, sitemap, robots, Open Graph e JSON-LD de negócio local com dados oficiais.
- Se não houver endereço público, usar `areaServed` e não inventar endereço.
- Preferir Azure Static Web Apps se a futura API .NET for hospedada no Azure; caso contrário, Cloudflare Pages ou Netlify/Vercel. A escolha final depende de custo e conta existente.
- Prever `apiBaseUrl` configurável por ambiente para a futura API .NET; nenhuma chamada será implementada agora.

### P-06 — Desempenho e acessibilidade

**Decisões de negócio**

- Meta de acessibilidade WCAG 2.2 AA.
- Suporte às duas últimas versões dos principais navegadores móveis e desktop, a detalhar no TDD.
- A avaliação com usuários faz parte do processo, com plano a definir em P-10.

**Decisões de implementação**

- Metas móveis: LCP ≤ 2,5 s, INP ≤ 200 ms e CLS ≤ 0,1.
- Lighthouse móvel: Performance ≥ 90, Acessibilidade ≥ 95 e SEO ≥ 90.
- Imagens de destaque ≤ 200 KB e de galeria ≤ 150 KB no tamanho exibido; WebP/AVIF, `srcset`, dimensões explícitas e lazy loading fora da primeira dobra.
- Fontes self-hosted, com subconjunto e `font-display: swap`.
- Texto entre 16 e 18 px, contraste mínimo de 4,5:1 e alvos de toque de pelo menos 44×44 px.
- Navegação por teclado, foco visível, rótulos, mensagens de erro claras e suporte a leitor de tela.
- Sem dependência de hover, sem timeout e sem animações excessivas; respeitar `prefers-reduced-motion`.
- Medir com Lighthouse CI e dispositivo real antes de fixar o orçamento final de JavaScript.

### P-07 — Pipeline de conteúdo

**Decisões de negócio**

- Os arquivos Markdown serão editados pelo desenvolvedor, com aprovação das alterações de cardápio pela empresa.
- CMS fica fora do escopo atual.

**Decisões de implementação**

- Parser em tempo de build lê `assets/cardapios/*.md`, valida a estrutura e gera dados tipados para os componentes.
- Sem parsing de Markdown em runtime.
- Modelo sugerido: `Menu`, `Category`, `Dish`, `Selection` e `QuoteRequest`, preservando ordem, nomes e categorias.
- Deduplicação apenas no catálogo de seleção, com chave normalizada (trim, minúsculas e espaços). Variantes como “Carpaccio de frutas” e “Carpaccio de frutas frescas” permanecem separadas até a decisão P-14.
- Testes de fidelidade verificam contagem de itens, nomes, categorias e ordem; o build falha se o Markdown fugir do formato.
- Originais somente leitura; alterações via Markdown, build e revisão.
- Criar uma interface de fonte de conteúdo que permita substituição futura por API .NET, sem implementar a API agora.

## 11. Decisões pendentes

As decisões P-01 a P-07 foram encerradas nesta versão. A pendência P-13 (infraestrutura do local) foi resolvida pela P-03: o local passa a ser campo próprio, com cidade obrigatória quando definido e nome do espaço ou endereço opcionais.

### Precisam de decisão antes da publicação

| ID | Decisão pendente | Observação |
|---|---|---|
| P-08 | Textos institucionais, rodapé, aviso de privacidade e políticas | Dependem de aprovação da empresa |
| P-09 | Analytics e medição | Qualquer ferramenta deve respeitar a decisão de não armazenar dados pessoais no navegador |
| P-10 | Plano de avaliação com usuários | Definir perfil, roteiro e métricas, incluindo adultos com pouca familiaridade tecnológica |
| P-11 | Prazo e marcos do TCC | O prazo estimado não está confirmado |
| P-12 | Detalhamento da Etapa 2 | Não deve ser iniciado antes da validação da Etapa 1; exige PRD e TDD próprios |
| P-14 | Variações e possíveis erros de digitação nos cardápios | “Talharinho”, “Carpaccio de frutas/frescas” e o nome `mesa-richots.png` serão preservados até confirmação |

### Dados e autorizações necessários antes da publicação

- Autorização de uso das três fotografias e autorização de imagem das pessoas que aparecem em `mesa-richots.png`, ou aprovação de recorte/desfoque.
- Créditos de fotógrafo, legendas e textos alternativos definitivos.
- Número oficial do WhatsApp e confirmação de que ele será exibido publicamente.
- Dados oficiais de SEO local: cidade/região, endereço público ou área de atendimento, telefone, horários e redes sociais.
- Domínio próprio e provedor de hospedagem.
- Textos institucionais, conteúdo do rodapé e política de privacidade.
- Confirmação de eventual perfil no Google Business Profile.

## 12. Dependências e processo de entrega

1. Aprovar esta versão 0.4 consolidada como base de requisitos.
2. Reunir dados oficiais e autorizações listados na seção 11; eles não bloqueiam o TDD, mas bloqueiam a publicação.
3. Prototipar a jornada em baixa fidelidade e revisar com o responsável pelo buffet.
4. Produzir o TDD (Technical Design Document) com arquitetura, modelo de conteúdo, acessibilidade, SEO/desempenho e estratégia de testes.
5. Aprovar o TDD.
6. Inicializar o OpenSpec e especificar as mudanças da Etapa 1.
7. Implementar em fatias pequenas, com testes de regras e fluxos, revisão e commits coerentes.
8. Validar em navegador mobile e desktop, especialmente WhatsApp, campos e acessibilidade.
9. Abrir Pull Request e concluir a validação da Etapa 1 com o responsável.
10. Somente depois iniciar a Etapa 2.

## 13. Riscos e premissas

- O prazo do TCC não está confirmado e pode ser curto; o cronograma precisa ser validado antes de assumir compromissos de entrega.
- As fotografias têm entre 2,5 e 3,1 MB e precisam de derivados otimizados para não prejudicar o desempenho móvel.
- A fotografia `mesa-richots.png` contém pessoas ao fundo e pode exigir autorização, recorte ou desfoque.
- Os cardápios não têm sobremesas, bebidas, preços, quantidades, ingredientes ou descrições; nada disso será inventado.
- Dados oficiais de SEO local e o número de WhatsApp ainda não foram fornecidos.
- Seleções longas podem gerar mensagens maiores do que o limite prático de uma URL; o TDD deve prever limite ou fallback.
- A ausência de armazenamento no navegador significa que recarregar a página pode perder a seleção; o fluxo deve ser curto e claro.
- A abertura do WhatsApp pode registrar a URL com a mensagem no histórico do navegador; o aviso de privacidade deve esclarecer isso.
- O escopo da Etapa 2 pode crescer e comprometer a Etapa 1; a priorização precisa ser mantida.
- A conversão dos Markdown em dados estruturados precisa preservar nomes, categorias e ordem dos itens.
- A autorização das fotografias e o tratamento das pessoas ao fundo ainda dependem de confirmação; sem isso, as imagens não podem ir para produção.
- A regra de data em três estados não cobre quinzena, intervalo ou período livre; essas informações devem ir para as observações, sem criar campos extras.
- O provedor de hospedagem e o domínio ainda não foram definidos; a escolha pode afetar custo, configuração de headers e integração futura.
- A lista de rotas pré-renderizadas precisa ser mantida a cada novo cardápio ou página institucional.

## 14. Histórico de versões

- **0.1** — rascunho inicial do PRD do site, com requisitos propostos e decisões em aberto.
- **0.2** — decisão de roadmap em duas etapas; Etapa 2 preservada como evolução do TCC; Etapa 1 delimitada como prioridade; TDD definido como Technical Design Document; pendências explicitadas.
- **0.3** — conteúdo real incorporado; três cardápios e três fotografias registrados; três caminhos de seleção; nome e quantidade aproximada de convidados obrigatórios; categorias preservadas; sobremesas removidas; pratos repetidos unificados apenas no catálogo; nenhum preço ou armazenamento de dados pessoais no navegador; pendências atualizadas.
- **0.4** — decisões P-01 a P-07 consolidadas: uso institucional e otimização das fotografias; `wa.me` com número configurável e fallback de cópia; data em exatamente três estados (dia/mês/ano, mês/ano ou não sei) e local com cidade obrigatória quando definido; rotas e fluxo de orçamento em três etapas; prerender em build com hospedagem estática; metas de Core Web Vitals, Lighthouse e WCAG 2.2 AA; parser de conteúdo em tempo de build com testes de fidelidade. P-13 resolvida pela P-03; pendências reduzidas a P-08 a P-12 e P-14, com dados e autorizações de publicação listados.
