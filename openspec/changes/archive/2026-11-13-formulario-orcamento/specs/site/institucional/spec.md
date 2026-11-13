# Spec Delta

## MODIFIED Requirements

### Requirement: Chamada honesta para a jornada de orçamento

Enquanto o fluxo `/orcamento` não existir, as páginas SHALL orientar a pessoa sobre a futura solicitação e oferecer apenas ações funcionais de consulta aos cardápios ou de navegação à explicação; SHALL NOT apresentar link ativo de envio, reserva, formulário ou WhatsApp indisponível. Quando o fluxo `/orcamento` existir, a chamada de solicitação SHALL encaminhar para ele, sem prometer contratação ou disponibilidade automática.

#### Scenario: Pessoa busca solicitar orçamento nesta entrega
- **WHEN** a pessoa lê uma chamada sobre orçamento antes de o fluxo estar disponível
- **THEN** entende que a solicitação ainda não está disponível e pode acessar os cardápios e a explicação, sem encontrar link quebrado ou promessa de envio

#### Scenario: Fluxo posterior de orçamento disponível
- **WHEN** uma mudança disponibiliza `/orcamento` com a solicitação efetiva
- **THEN** a chamada de solicitação encaminha à rota real sem alterar os cardápios nem prometer contratação ou disponibilidade automática
