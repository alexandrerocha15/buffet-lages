# Proposal

## Why

O site apresenta os cardápios, mas ainda não permite transformar a escolha em uma solicitação estruturada de orçamento. Esta mudança completa a jornada comercial definida no PRD: seleção baseada no conteúdo real, revisão pelo cliente e abertura explícita de uma mensagem no WhatsApp, sem contratação, reserva ou cálculo de preço.

## What Changes

- Criar o fluxo completo de orçamento, acessível a partir da Home e das páginas de cardápio, com os caminhos “Solicitar orçamento deste cardápio” (todos os itens inicialmente selecionados) e “Montar meu próprio cardápio”.
- Permitir selecionar/remover pratos do catálogo tipado existente por categoria e cadastrar pedidos especiais: digitar e pressionar Enter adiciona à lista visual, com edição e remoção, sem alterar os Markdown originais. Permitir avançar com ao menos um prato de catálogo ou um pedido especial válido.
- Apresentar prévia do cardápio escolhido, permitir retorno à edição sem perder a seleção e exigir confirmação do cardápio para avançar.
- Coletar nome, estimativa de convidados, data e local nos estados já definidos pelo PRD/TDD e observações gerais opcionais, separadas dos pedidos especiais.
- Apresentar revisão completa e abrir WhatsApp somente após confirmação explícita, com mensagem organizada, fallback para mensagem longa e comunicação de que não há reserva, contratação ou disponibilidade confirmada.
- Preservar o estado somente em memória; manter a solução sem backend, banco de dados, persistência local e preços automáticos.
- Atualizar as capacidades institucionais e de cardápios para tornar ativas as chamadas de orçamento e seleção quando o fluxo estiver disponível.

## Capabilities

### New Capabilities
- `site/orcamento`: seleção, personalização, pedidos especiais, prévia, formulário, revisão e encaminhamento consciente ao WhatsApp.

### Modified Capabilities
- `site/institucional`: chamadas de orçamento passam a apontar para o fluxo efetivo após sua disponibilidade, substituindo a regra temporária de chamadas apenas informativas.
- `site/cardapios`: páginas dos cardápios oferecem os dois caminhos de entrada para seleção e montagem, substituindo a regra temporária contra seleção.

## Impact

- Angular: novas rotas/telas do fluxo, estado em memória, validações, apresentação do resumo e serviço de composição/link do WhatsApp.
- Integração com o pipeline existente `MenuSource` e dados tipados gerados dos Markdown; sem mudança nos arquivos editoriais ou no parser.
- Configuração de ambiente para número oficial do WhatsApp, com placeholder não publicável; número real depende de confirmação da empresa.
- Testes unitários e de jornada para seleções, validações, mensagem, fallback, acessibilidade e responsividade. Nenhuma alteração de backend, persistência, preço, deploy ou publicação faz parte desta mudança.
- **Divergência registrada:** o critério de seleção mínima do PRD P-03 e TDD §7.1 diz “pelo menos 1 item”/“mínimo 1 item”, sem definir pedido especial como alternativa. Esta mudança explicita prato de catálogo **ou** pedido especial válido para permitir pedidos inteiramente personalizados; PRD e TDD não são alterados nesta mudança.
