# Levantamento consolidado

## Confirmado na conversa
- Marca: Buffet Lages; foco comercial principal em prestação de serviço de buffet para eventos.
- Necessidade imediata: presença digital profissional e captação de solicitações de orçamento.
- Stack desejada para o site: Angular.
- Entrada pública: fotos reais, ao menos três cardápios de referência, opção de montar cardápio.
- Dois caminhos de orçamento: cardápio modelo ou cardápio personalizado; ambos terminam no mesmo fluxo de coleta de dados e WhatsApp.
- Dados iniciais relevantes: data, número aproximado de pessoas, local e observações. Data e local são opcionais e podem ser aproximados ou indefinidos; quantidade de convidados pode ser estimada.
- Preço final de buffet: negociado manualmente; sem cálculo automático no MVP.
- Atualizações de conteúdo: feitas pelo desenvolvedor no início, sem CMS nem login.
- Acervo de locação existe, mas a frente de locações não é prioridade do primeiro protótipo.

## Propostas de interface ainda sujeitas a teste
- Consultar cardápio modelo em modal.
- Seleção personalizada organizada em categorias; caixa/lista visual para escolhas.
- Uso de SVG/ícones provisórios para pratos ou categorias; fotografias reais para a vitrine principal.
- Mensagem WhatsApp pré-preenchida com resumo legível, não envio silencioso ou automático.

## Ideias futuras — NÃO implementar agora
- Catálogo de materiais com fotos, preços e caixa de seleção, com solicitação pelo WhatsApp.
- Controle de disponibilidade por data/período, reservas, separação, retirada, devolução, avarias e estoque.
- Painel administrativo mobile para manutenção de conteúdo.
- Sistema de gestão de locações, posteriormente definido como Etapa 2 do TCC e possível produto para terceiros; continua fora do MVP da Etapa 1.
- Integração via API entre site público e sistema independente.

## Questões em aberto
- Identidade visual, textos finais, fotografias autorizadas e cardápios efetivos.
- Número e WhatsApp comercial oficial a ser configurado por ambiente.
- Definir quais campos, se houver, precisam ser obrigatórios; data e local não podem ser exigidos como definitivos.
- Como representar o local (cidade/bairro/endereço livre) e privacidade dos dados.
- Conteúdo de rodapé, políticas e informações institucionais aprovadas.
- Hospedagem, domínio, estratégia de SEO e modo de renderização Angular.
- Necessidade de persistência local temporária da seleção; avaliar com atenção a privacidade.
- Critérios e cronograma de avaliação com pessoas usuárias.

## Restrições e cuidados
- Não divulgar nomes de familiares, narrativas pessoais, telefones privados, preços reais ou inventário exato sem autorização.
- Não afirmar que um pedido foi recebido apenas porque o WhatsApp foi aberto: o envio depende de ação do cliente no aplicativo.
- Não anunciar reserva, disponibilidade, contrato ou pagamento confirmados sem validação humana.
