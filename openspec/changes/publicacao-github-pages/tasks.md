# Tasks

## 1. Build e compatibilidade com o subcaminho

- [x] 1.1 Configurar o build de produção com base `/buffet-lages/` substituível para futura hospedagem e verificar no HTML de produção o `<base href>` esperado.
- [x] 1.2 Corrigir referências a imagens, favicon, fontes e demais recursos para respeitarem a base; validar que os URLs do artefato apontam ao prefixo `/buffet-lages/` em todas as páginas pré-renderizadas.
- [x] 1.3 Validar geração e navegação de todas as rotas públicas existentes (`/`, cardápios, `/montar` e `/orcamento`); verificar que cada rota gera HTML direto atualizável e que URLs internas preservam o prefixo.
- [x] 1.4 Criar ou atualizar testes automatizados para base href, caminhos de recursos e inventário de rotas pré-renderizadas; verificar que falham diante de uma rota ausente ou caminho incorreto.

## 2. Workflow de validação e publicação

- [x] 2.1 Criar workflow GitHub Actions para PRs e pushes à `main`, usando `npm ci`, Node 24.15.0, lint, testes e build de produção; verificar a sintaxe e a lógica de gatilhos/permissões localmente.
- [x] 2.2 Configurar o job de publicação para usar somente o artefato estático `dist/buffet-lages/browser`, com permissões Pages/OIDC mínimas e gatilho restrito a `main`; verificar estaticamente que branches de trabalho não satisfazem a condição de deploy.
- [x] 2.3 Registrar como pré-requisito operacional habilitar GitHub Pages com origem GitHub Actions; verificar o conteúdo da documentação.
- [ ] 2.4 Verificar no site publicado Home, cardápios, `/montar` e `/orcamento` por navegação, abertura direta e atualização; inspecionar assets e confirmar que o WhatsApp abre `5549991014293` sem envio automático.
- [x] 2.5 Documentar a hospedagem inicial no GitHub Pages, as limitações de fallback/headers/cache e a divergência aprovada com PRD/TDD; verificar que cardápios, identidade visual e funcionalidades não foram alterados.
- [ ] 2.6 Confirmar numa execução real do GitHub Actions em pull request que o workflow valida sem publicar; isso requer abrir/atualizar um PR e permanece pendente até essa execução.
