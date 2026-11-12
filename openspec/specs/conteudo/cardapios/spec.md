# conteudo/cardapios Specification

## Purpose

Transforma os cardápios Markdown editoriais do Buffet Lages em dados tipados, validados e fiéis aos originais durante o build, fornecendo à aplicação um catálogo de cardápios e um catálogo unificado de pratos sem qualquer parsing em runtime.

## Requirements

### Requirement: Leitura dos cardápios originais

O pipeline SHALL ler todos os arquivos Markdown de `assets/cardapios/` como fonte editorial única e SHALL tratá-los como somente leitura, sem alterar seu conteúdo, codificação ou estrutura.

#### Scenario: Geração lê todos os cardápios disponíveis

- **WHEN** a geração de conteúdo é executada
- **THEN** cada arquivo `.md` presente em `assets/cardapios/` é lido e produz exatamente um cardápio
- **AND** os arquivos originais permanecem byte a byte inalterados

#### Scenario: Diretório de origem sem cardápios

- **WHEN** a geração é executada e nenhum arquivo `.md` existe em `assets/cardapios/`
- **THEN** a geração falha com mensagem que identifica o diretório de origem vazio

### Requirement: Identificação estável de cada cardápio

Cada cardápio gerado SHALL possuir um identificador estável derivado do nome do arquivo de origem e SHALL preservar o título exatamente como escrito no Markdown.

#### Scenario: Identificador derivado do nome do arquivo

- **WHEN** o arquivo `italiano.md` é processado
- **THEN** o cardápio gerado possui identificador `italiano`
- **AND** seu título é exatamente o texto do cabeçalho H1 do arquivo

#### Scenario: Arquivos com nomes distintos não colidem

- **WHEN** dois arquivos de origem produzem o mesmo identificador estável
- **THEN** a geração falha e identifica o conflito

### Requirement: Validação estrutural do Markdown

A geração SHALL validar o formato esperado de cada arquivo — um único cabeçalho H1, subtítulo `**Buffet Lages**`, categorias H2 e itens de lista — e SHALL falhar sem produzir dados parciais quando o formato for violado.

#### Scenario: Estrutura válida é aceita

- **WHEN** um arquivo contém um H1, o subtítulo esperado, ao menos uma categoria H2 e ao menos um item `- ` em cada categoria
- **THEN** o arquivo é convertido em cardápio válido

#### Scenario: Item fora de categoria

- **WHEN** um item de lista aparece antes de qualquer categoria H2
- **THEN** a geração falha com mensagem que identifica o arquivo e a linha do item

#### Scenario: Categoria sem itens

- **WHEN** uma categoria H2 não possui ao menos um item de lista
- **THEN** a geração falha com mensagem que identifica o arquivo e a categoria

#### Scenario: Cabeçalhos ou tokens inesperados

- **WHEN** um arquivo contém zero ou mais de um H1, subtítulo diferente do esperado, linhas fora do formato aceito ou codificação inválida
- **THEN** a geração falha com mensagem acionável que identifica arquivo e linha
- **AND** nenhum dado gerado é publicado a partir desse estado

### Requirement: Preservação de nomes, categorias e ordem

Os dados gerados SHALL reproduzir exatamente os nomes de categorias e de pratos, a grafia, os acentos e a ordem em que aparecem em cada arquivo original.

#### Scenario: Nomes e ordem idênticos aos originais

- **WHEN** um cardápio válido é gerado
- **THEN** suas categorias e seus itens aparecem na mesma ordem e com o mesmo texto do Markdown
- **AND** variações de grafia e possíveis erros de digitação são preservados, sem correção automática

#### Scenario: Nenhuma categoria ou prato inventado

- **WHEN** os dados gerados são inspecionados
- **THEN** eles contêm apenas categorias e pratos presentes nos arquivos originais
- **AND** não contêm sobremesas, bebidas, preços, quantidades, ingredientes ou descrições ausentes na fonte

### Requirement: Catálogo tipado consumível em tempo de build

A aplicação SHALL obter os cardápios a partir de dados tipados gerados durante o build e SHALL NOT interpretar Markdown em tempo de execução.

#### Scenario: Consumo dos dados gerados

- **WHEN** a aplicação solicita os cardápios à fonte de conteúdo
- **THEN** recebe os dados tipados gerados no build, com cardápios, categorias e pratos preservados

#### Scenario: Ausência de parsing em runtime

- **WHEN** o bundle entregue ao cliente é inspecionado
- **THEN** ele não contém interpretador de Markdown nem os arquivos `.md` originais
- **AND** os cardápios exibidos derivam exclusivamente dos dados gerados

### Requirement: Catálogo unificado com deduplicação normalizada

O pipeline SHALL derivar um catálogo unificado de pratos com chave normalizada — remoção de espaços nas extremidades, minúsculas e colapso de espaços internos — mantendo a deduplicação restrita a esse catálogo e as listas completas nos cardápios originais.

#### Scenario: Prato repetido aparece uma vez no catálogo unificado

- **WHEN** o mesmo prato aparece em mais de um cardápio
- **THEN** o catálogo unificado o apresenta uma única vez
- **AND** registra os cardápios em que aparece

#### Scenario: Cardápios mantêm suas repetições

- **WHEN** um prato repetido entre cardápios é consultado no cardápio de origem
- **THEN** ele permanece na lista completa desse cardápio, na posição original

#### Scenario: Variações de grafia permanecem separadas

- **WHEN** dois nomes diferem em palavras ou acentuação além de espaços e caixa
- **THEN** eles geram chaves distintas e permanecem itens separados no catálogo unificado

#### Scenario: Conflito de categoria

- **WHEN** o mesmo prato normalizado aparece em categorias diferentes entre cardápios
- **THEN** a geração falha e identifica o prato e as categorias em conflito

### Requirement: Testes de fidelidade derivados dos originais

A verificação de fidelidade SHALL calcular suas expectativas a partir dos próprios arquivos Markdown, e SHALL NOT depender de contagens fixas que impeçam alterações legítimas de conteúdo.

#### Scenario: Conteúdo legítimo alterado continua válido

- **WHEN** um cardápio original recebe um prato ou uma categoria nova em formato válido
- **THEN** geração e testes de fidelidade passam sem exigir atualização de números fixos

#### Scenario: Divergência entre originais e dados gerados

- **WHEN** nomes, categorias, ordem, contagem de ocorrências ou catálogo unificado divergem dos arquivos originais
- **THEN** a verificação de fidelidade falha e o build é interrompido

### Requirement: Geração determinística e reproduzível

A geração SHALL ser determinística para o mesmo conjunto de arquivos de entrada e SHALL funcionar a partir de um checkout limpo, sem depender de dados versionados ou de execução prévia manual.

#### Scenario: Mesma entrada produz a mesma saída

- **WHEN** a geração é executada duas vezes sem alterar os originais
- **THEN** os dados produzidos são idênticos

#### Scenario: Checkout limpo

- **WHEN** o projeto é instalado e o build é executado sem dados gerados previamente
- **THEN** a geração ocorre antes da compilação e o build conclui com os cardápios disponíveis
