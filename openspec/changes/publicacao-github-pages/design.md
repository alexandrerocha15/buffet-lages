# Design

## Context

Ver `proposal.md` para motivação e `specs/infraestrutura/publicacao-estatica/spec.md` para os contratos. Hoje o Angular usa `base href="/"`, há referências a imagens iniciadas em `/img/`, e o build estático produz `dist/buffet-lages/browser`, com HTMLs pré-renderizados para Home, cardápios e fluxos existentes. Não há workflow próprio em `.github/workflows/`. A branch remota `origin/main` já contém o estado funcional atual, embora a branch local `main` esteja atrás.

## Goals / Non-Goals

**Goals:**

- Fazer o build e as URLs funcionarem sob `/buffet-lages/`.
- Publicar somente a saída estática de produção, validada, a partir de `main`.
- Testar rotas geradas tanto por acesso direto/atualização quanto pela navegação interna.

**Non-Goals:**

- Alterar cardápios, identidade visual, regras ou funcionalidades do orçamento.
- Criar backend, persistência ou tratar o telefone do WhatsApp como segredo.
- Configurar domínio próprio nesta etapa ou prometer suporte a rotas arbitrárias não pré-renderizadas.
- Implementar todos os headers, regras avançadas de cache ou redirects previstos para outros provedores no TDD.

## Decisions

1. **Base de publicação definida pelo caminho de projeto.** O build de produção deve usar `/buffet-lages/` como base, mantendo possibilidade de substituir esse valor quando houver domínio próprio ou outro destino. Usar `/` como base fixa foi rejeitado porque resolve assets e navegação na raiz do domínio, não no subdiretório publicado.

2. **Recursos referenciados respeitam a base configurada.** Revisar caminhos absolutos como `/img/...` e favicon, e validar também CSS, fontes, imagens e bundles no HTML gerado. Caminhos relativos ao documento podem falhar em rotas aninhadas; a implementação deve preferir URLs derivadas da base do app ou outra forma equivalente que passe os testes em todas as páginas.

3. **Prerender é o mecanismo de resolução de rotas do Pages.** Publicar o conteúdo de `dist/buffet-lages/browser`, incluindo os `index.html` gerados para rotas suportadas. Verificar que os caminhos finais de todos os destinos existentes são emitidos e que uma atualização serve o HTML pré-gerado. Não adotar `HashLocationStrategy` nem depender de fallback SPA: isso mudaria URLs e não é necessário para rotas pré-renderizadas. URLs não geradas podem retornar 404 no GitHub Pages.

4. **Workflow em duas fases, com produção somente em `main`.** Em pull requests, executar validações e build sem deploy. Em push à `main`, repetir as verificações e publicar a mesma saída estática com as actions oficiais de Pages, permissões mínimas (`contents: read`, `pages: write`, `id-token: write` somente no job de deploy) e concorrência para evitar deploys concorrentes. Habilitar Pages como origem GitHub Actions nas configurações do repositório é pré-requisito operacional.

5. **Validar com versões suportadas pelo repositório e dados públicos confirmados.** CI deve instalar com `npm ci` usando Node compatível com `engines` (Node 24.15.0) e executar lint, testes/validações de conteúdo e build de produção. O número `5549991014293` permanece configurado no bundle cliente; armazená-lo em GitHub Secret não o tornaria secreto depois da publicação, então não criar falsa proteção com secret.

6. **Manter os documentos de produto sem alteração nesta mudança.** A hospedagem inicial aprovada diverge do PRD, que pede domínio próprio, e das opções listadas no TDD (Azure Static Web Apps, Cloudflare Pages, Netlify/Vercel). Tratar isso como exceção deliberada: GitHub Pages primeiro, domínio próprio futuramente. Também não assumir suporte a headers e controles de cache descritos no TDD. Registrar essa divergência para eventual revisão documental posterior, fora do escopo atual.

## Risks / Trade-offs

- [Referência absoluta esquecida] → algum asset pode carregar localmente e falhar no subpath; auditar referências no código e testar URLs do artefato sob `/buffet-lages/`.
- [Rota sem arquivo pré-renderizado] → atualização pode resultar em 404; validar inventário das rotas suportadas contra a saída antes de publicar.
- [Ações do Pages ou permissões não configuradas] → deploy falha; documentar configuração inicial do repositório e limitar permissões por job.
- [GitHub Pages não fornece configuração completa de headers/cache/redirects] → aceitar essa limitação para a hospedagem inicial; reavaliar ao adotar domínio próprio ou outro provedor.
- [Número de WhatsApp é público] → confirmar que a empresa autoriza sua exibição; não incluir credenciais ou dados privados no bundle.

## Migration Plan

1. Configurar build e verificações localmente/CI, sem alterar a publicação ativa.
2. Habilitar GitHub Pages com origem GitHub Actions e confirmar permissões do repositório.
3. Integrar a mudança em `main`; o workflow valida e publica o artefato.
4. Verificar a Home, páginas de cardápio, `/montar` e `/orcamento`, assets, navegação e atualização direta no URL publicado.
5. Em caso de falha, corrigir ou reverter a alteração de configuração/workflow em um novo commit e republicar a versão válida anterior; nenhum banco ou dado de usuário precisa ser migrado.

## Open Questions

Nenhuma decisão adicional bloqueia o planejamento. A configuração de domínio próprio e a eventual revisão de PRD/TDD ficam para uma mudança futura.
