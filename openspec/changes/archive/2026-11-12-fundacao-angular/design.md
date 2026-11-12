# Design

## Context

Consulte `proposal.md` para a motivação e o escopo. O repositório ainda não tem aplicação Angular; PRD 0.4 e TDD 0.2 definem a arquitetura desejada. Em especial, o TDD determina Angular standalone, builder `@angular/build:application`, prerender em build, saída estática, npm, TypeScript strict, ESLint e Prettier. A versão exata do Angular deve ser a estável vigente quando a implementação começar; Node.js deve ser LTS vigente.

## Goals / Non-Goals

**Goals:**

- Estabelecer uma base mínima executável e coerente com a arquitetura e com a árvore de pastas do TDD.
- Deixar o build local capaz de gerar a saída estática pré-renderizada da rota inicial mínima.
- Tornar explícitas as versões de runtime e dependências para instalação reproduzível.

**Non-Goals:**

- Implementar layout ou conteúdo institucional, rotas finais, páginas de cardápio ou funcionalidades comerciais.
- Implementar pipeline de cardápios, imagens ou geração dinâmica de rotas; são mudanças posteriores.
- Configurar deploy, hospedagem, CI/CD ou portões de publicação.
- Incluir chamadas de rede, API, persistência de dados pessoais ou qualquer funcionalidade da Etapa 2.

## Decisions

1. **Inicializar via Angular CLI e manter a configuração nativa do Angular.** Usar a versão estável vigente no início da implementação, registrar a versão exata nos manifests e evitar abstração de build adicional. Alternativa considerada: copiar uma estrutura manual ou usar outro scaffold; rejeitada por aumentar o risco de incompatibilidade com o builder e os padrões do Angular escolhidos.

2. **Usar o builder `@angular/build:application` com prerender de build.** O alvo desta mudança é a geração estática da rota inicial mínima, sem servidor SSR em runtime. Alternativa considerada: SPA sem prerender ou SSR em runtime; ambas contrariam o TDD.

3. **Fixar Node LTS e dependências com os mecanismos do npm.** Registrar a versão LTS adotada em `.nvmrc` e `engines`, manter `package-lock.json` e usar `npm ci` como verificação de instalação limpa. A versão concreta é escolhida no início da implementação, conforme a regra temporal do TDD; não se fixa uma versão futura neste plano.

4. **Criar somente o esqueleto estrutural necessário.** Preparar diretórios e arquivos-base previstos no TDD, sem criar ainda implementações de features ou pipelines. Manter os arquivos editoriais e fotográficos originais como conteúdo protegido, sem leitura ou transformação nesta mudança.

5. **Configurar qualidade sem ampliar a stack visual.** Habilitar TypeScript `strict`, ESLint e Prettier; manter CSS puro e npm, sem framework de UI. A escolha do runner unitário seguirá a regra do TDD: Vitest se suportado pela versão Angular escolhida; caso contrário Karma/Jasmine padrão.

## Risks / Trade-offs

- [A versão estável do Angular pode mudar entre planejamento e implementação] → Escolher e registrar versões no momento da implementação, validar compatibilidade com Node LTS e preservar o lockfile.
- [O scaffold do Angular CLI pode incluir arquivos ou opções fora do escopo] → Revisar cada arquivo gerado contra o TDD e remover/evitar configuração de funcionalidades futuras, sem alterar os documentos aprovados nem os originais.
- [Prerender inicial pode ser confundido com implementação das rotas finais] → Limitar a verificação à rota inicial mínima; a geração do conjunto de rotas fica para a mudança de pipeline/conteúdo.
- [Lint, formatter e runner podem divergir dos defaults disponíveis na versão escolhida] → Registrar as escolhas no projeto e validar instalação e comandos antes de encerrar a fundação.

## Migration Plan

Não há migração de usuários nem implantação nesta mudança. Criar a base em novos arquivos, executar instalação reproduzível e build de produção com prerender. Em caso de falha, corrigir a configuração da fundação antes de iniciar a próxima mudança; não substituir nem editar documentos aprovados ou arquivos originais de `assets/`.
