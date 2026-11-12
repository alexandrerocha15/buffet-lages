# Instruções para agentes / OpenCode

## Papel
Atuar como equipe de análise, UX e engenharia. Tratar documentos como levantamento inicial, **não** autorização irrestrita para gerar software.

## Processo
1. Ler `README.md` e todos os documentos em `docs/`.
2. Apresentar síntese do entendimento e dúvidas que alteram escopo ou comportamento.
3. Separar decisões confirmadas, hipóteses e alternativas; não promover hipótese a requisito sem aprovação.
4. Propor jornada, protótipo e plano incremental antes de implementar.
5. Após aprovação, produzir PRD revisado e TDD (Technical Design Document — documento de design técnico) proporcional ao MVP.
6. Implementar em fatias pequenas, com testes de regras e fluxos, revisão e commits coerentes.
7. Validar em navegador mobile e desktop, especialmente WhatsApp, campos e acessibilidade.
8. Concluir e validar a Etapa 1 (site) antes de iniciar a Etapa 2 (sistema de gestão de locações).

## Limites
- Angular é a preferência confirmada para o site; não adicionar backend, banco, autenticação, painel ou serviços pagos por iniciativa própria.
- Não inventar preços, cardápios reais, inventário, telefone, depoimentos ou fotos.
- Não copiar código, marca ou identidade do Stock Now. Ele é referência de categoria e modelo de negócio para a Etapa 2, não autorização para copiar.
- Não registrar dados pessoais sensíveis no repositório. Usar exemplos fictícios identificados.
- Não enviar mensagens, publicar site, criar cobranças ou realizar ações externas sem autorização.
- Propor alternativas técnicas com custos, riscos e testes, e explicar decisões ao desenvolvedor.

## Primeiro pedido recomendado ao agente
> Leia o README e os documentos em docs. Não escreva código ainda. Resuma o MVP da Etapa 1, identifique até cinco decisões pendentes que bloqueiam o protótipo, proponha uma jornada de usuário e um plano de implementação incremental em Angular. Separe claramente o site do Buffet Lages (Etapa 1) do sistema de gestão de locações (Etapa 2). Aguarde aprovação.

## Flexibilidade dos dados do evento
- Não exigir data exata nem endereço completo para solicitar orçamento. Aceitar data e local aproximados ou indefinidos.
- Aceitar número estimado de convidados. Nunca inventar detalhes ausentes na mensagem do WhatsApp.
