# Tasks

## 1. Ativo responsivo da navbar

- [x] 1.1 Atualizar a geração do ativo da navbar para usar `assets/fotos/logo-nav.png`, mantendo o derivado do chapéu baseado em `logo-chapel.png`; validar por teste que ambos os arquivos-fonte permanecem intocados e os derivados preservam transparência e proporção.
- [x] 1.2 Atualizar os testes do gerador para conferir o derivado horizontal da navbar e o derivado do chapéu; executar o teste de geração e confirmar os resultados.

## 2. Apresentação compartilhada

- [x] 2.1 Compor o chapéu oficial à esquerda da logomarca horizontal significativamente ampliada na navbar, com link para Home somente no chapéu; atualizar teste de componente para validar os dois ativos e destinos.
- [x] 2.2 Aumentar o chapéu do rodapé para tamanho proporcionalmente mais legível e manter alinhamento com “Buffet Lages”; atualizar teste para conferir nome, proporção e alinhamento sem alterações de cor ou texto.

## 3. Validação integrada

- [x] 3.1 Atualizar e executar o teste Playwright em desktop e mobile, verificando carregamento dos dois ativos, composição equilibrada, proporções, legibilidade, link Home no chapéu, `logo-nav` não clicável, altura da navbar e ausência de rolagem horizontal.
- [x] 3.2 Executar testes, lint e build de produção; verificar que a navbar aproveita a altura disponível sem aumento desnecessário e que favicon, cores, navegação e demais funcionalidades permanecem inalterados.

## 4. Refinamentos da revisão visual

- [x] 4.1 Reduzir a altura e o volume visual da navbar em desktop e mobile, preservando a composição oficial e a navegação; atualizar o teste Playwright para verificar dimensões e ausência de overflow.
- [x] 4.2 Ajustar a sombra do carrossel para subir suavemente da base das fotografias; atualizar verificação visual automatizada para confirmar gradiente ascendente, baixa intensidade e legibilidade do conteúdo.
- [x] 4.3 Executar testes, lint e build; verificar que somente navbar e sombra das fotos foram alteradas e que as demais funcionalidades e cores permanecem preservadas.
- [x] 4.4 Manter `logo-nav` horizontal não interativa e tornar somente o chapéu (`logo-chapel`) link para Home; atualizar testes de componente e Playwright para comprovar os destinos separados.
