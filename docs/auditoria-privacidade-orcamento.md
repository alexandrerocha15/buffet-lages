# Auditoria automatizada de privacidade do orçamento

Verificação executada durante a implementação da mudança `formulario-orcamento`.

- `npm run audit:quote-privacy` verifica os módulos de estado, composição WhatsApp e tela do orçamento: não encontrou APIs de armazenamento local, cookies, chamadas HTTP próprias nem endpoints/backend.
- A suíte Playwright (12/12 testes aprovados) intercepta as requisições de rede na jornada em Chromium desktop e em emulação Pixel 7/Chromium: não observou requisições para origens externas. A emulação não equivale a teste em aparelho Android real.
- A mesma jornada substitui os acessos a `localStorage`/`sessionStorage` por getters que falham e confirma que não foram lidos; também confirma ausência de cookie criado pela jornada.
- O estado do orçamento é mantido em signals do Angular durante a página. O destino externo `wa.me` só é aberto por ação confirmada; nenhum envio automático é feito.

Escopo e limites: são verificações automatizadas do código e da jornada executada neste ambiente. Não equivalem a pentest, revisão de dependências ou validação manual de navegadores/dispositivos móveis. O teste de rede cobre a sessão testada e a origem local servida pelo Playwright.
