# Spec Delta

## MODIFIED Requirements

### Requirement: Consulta sem seleção prematura

As páginas de cardápio SHALL oferecer acesso aos demais cardápios e informar a jornada de orçamento sem simular escolha, personalização ou envio antes de `/orcamento` e `/montar` existirem. Com os fluxos disponíveis, SHALL exibir os CTAs “Solicitar orçamento deste cardápio” e “Montar meu próprio cardápio” em seção própria e centralizada, sem prometer reserva ou disponibilidade comercial.

#### Scenario: Visitante deseja continuar após conhecer um cardápio
- **WHEN** a pessoa chega ao fim da página de um cardápio antes de `/orcamento` e `/montar` existirem
- **THEN** consegue consultar os demais cardápios e a explicação da jornada futura, sem botão que a direcione a fluxo inexistente

#### Scenario: Visitante escolhe um cardápio
- **WHEN** a pessoa chega ao cardápio após os fluxos de seleção estarem disponíveis
- **THEN** pode iniciar uma solicitação com esse cardápio ou iniciar a montagem própria, sem promessa de contratação ou disponibilidade comercial
- **AND** encontra os dois CTAs juntos numa seção dedicada, centralizada e coesa com a identidade visual do Buffet Lages
- **AND** a seção substitui a disposição dividida entre “Outros cardápios” e um bloco escuro de orçamento
