# Entrevista de descoberta — reconstrução temática

**Status:** reconstruída a partir de conversa exploratória, não transcrição literal. As perguntas abaixo foram reorganizadas pelo **Agente analista de requisitos** para facilitar o uso por agentes. As respostas sintetizam informações fornecidas pelo **Responsável pelo buffet**. Não atribuir frases como citações literais.

### 1. Qual a motivação para o site?
**Agente analista de requisitos:** Qual problema o site deve resolver primeiro?

**Responsável pelo buffet:** O negócio precisa ampliar sua presença digital, apresentar a qualidade e o histórico de seus eventos e facilitar o contato com novos clientes. O serviço principal é a realização de eventos, não a locação avulsa de materiais.

### 2. O que o cliente deve encontrar?
**Agente analista de requisitos:** Como imagina a experiência inicial?

**Responsável pelo buffet:** Uma página de apresentação com navegação, contato e chamada para orçamento, ao menos três fotografias reais de eventos em destaque, e ao menos três cardápios de referência. Os cardápios devem poder ser consultados sem abandonar desnecessariamente a página, por exemplo em modal.

### 3. Cardápios são pacotes fechados?
**Agente analista de requisitos:** O cliente precisa aceitar um cardápio sem mudanças?

**Responsável pelo buffet:** Não. Os modelos servem como referência e podem ser solicitados como base. Também é possível montar uma seleção personalizada de pratos. A negociação e o preço final dependem da avaliação humana.

### 4. Como funcionaria a montagem personalizada?
**Agente analista de requisitos:** Que opções o cliente deve selecionar?

**Responsável pelo buffet:** Em página específica, escolher pratos agrupados por carnes, acompanhamentos, saladas e sobremesas, reunindo escolhas numa seleção. Se não encontrar algo, poderá explicar em observações. Ícones SVG ou ilustrações provisórias podem representar categorias enquanto não houver fotografias apropriadas.

### 5. Que dados são importantes para o orçamento?
**Agente analista de requisitos:** O que normalmente é perguntado no atendimento?

**Responsável pelo buffet:** Número aproximado de pessoas, data e local do evento são informações úteis para avaliar o pedido, mas data e local podem estar indefinidos ou ser apenas estimativas. O cardápio escolhido ou montado e observações também importam. A infraestrutura do local influencia o atendimento e a logística. A disponibilidade é verificada na agenda; uma data pode comportar mais de um evento.

### 6. Como o pedido chega à empresa?
**Agente analista de requisitos:** O que deve ocorrer após a seleção?

**Responsável pelo buffet:** Na primeira versão, o cliente conclui um formulário e abre uma mensagem estruturada no WhatsApp da empresa. A pessoa responsável continua a negociação por conversa. Não há contratação, pagamento ou reserva automática nessa etapa.

### 7. Como são definidos preços de buffet?
**Agente analista de requisitos:** É possível calcular preço final automaticamente?

**Responsável pelo buffet:** Não é adequado para o protótipo inicial. O valor depende de quantidade de convidados, pratos, local, estrutura e logística, além de condições de mercado. Os cardápios modelo têm faixas de referência, não preços imutáveis.

### 8. Como é a operação interna hoje?
**Agente analista de requisitos:** Como controlam agenda e preparação?

**Responsável pelo buffet:** Contato por WhatsApp, registros em agenda física, avaliação de equipe e materiais, preparação antecipada e compras conforme oportunidade e perecibilidade. Eventos próximos e até solicitações de última hora podem ser atendidos após avaliação.

### 9. E a locação de materiais?
**Agente analista de requisitos:** O que foi imaginado para essa frente?

**Responsável pelo buffet:** Há acervo próprio de diferentes materiais. Numa fase posterior, um catálogo com fotos, quantidades de referência, preço unitário e seleção em uma “caixa” permitiria enviar pedido pelo WhatsApp. A primeira versão dessa frente não precisaria bloquear estoque nem confirmar disponibilidade automaticamente.

### 10. O que se imagina para um sistema mais robusto?
**Agente analista de requisitos:** Existe interesse além do site?

**Responsável pelo buffet:** Sim, numa plataforma de gestão de locações inspirada em soluções do mercado, com reservas por período, disponibilidade, retirada, devolução e controle operacional. Poderia ser validada com usuários reais e eventualmente tornar-se produto comercial, mas não é escopo aprovado do site inicial.

### 11. Quem manterá o site?
**Agente analista de requisitos:** É necessário painel administrativo agora?

**Responsável pelo buffet:** Inicialmente o desenvolvedor fará as alterações de fotos e conteúdo e publicará novas versões. A responsável pelo atendimento utiliza celular; um painel simples e adaptado a dispositivos móveis pode ser estudado no futuro, sem login administrativo nesta primeira entrega.

### 12. Qual tecnologia e forma de trabalho?
**Agente analista de requisitos:** Como pretende desenvolver?

**Responsável pelo buffet:** Angular no frontend, com OpenCode e agentes, seguindo a abordagem de entrevista, PRD, especificação, implementação e testes aprendida na Academia do Programador. Deseja começar por um protótipo verificável e evoluir com feedback, sem assumir funções futuras como entregas obrigatórias.
