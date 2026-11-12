# Pipeline de cardápios

Os arquivos de `assets/cardapios/*.md` são a fonte editorial. Não edite os dados gerados em `src/app/content/`.

## Formato aceito

Cada arquivo deve ser UTF-8 sem BOM e conter, nesta ordem:

```md
# Título do cardápio
**Buffet Lages**

## Nome da categoria
- Nome exato do prato
```

Use um único H1, o subtítulo literal `**Buffet Lages**`, uma ou mais categorias H2 e ao menos um item `- ` por categoria. Texto fora desses elementos não é aceito. Preserve a grafia e a ordem editoriais.

## Comandos

- `npm run generate:menus`: valida os arquivos e gera `src/app/content/menus.generated.ts`.
- `npm run test:content`: executa os testes de parser, catálogo e fidelidade.
- `npm run verify:content`: gera, verifica os tipos dos scripts e roda os testes de conteúdo.
- `npm run build`: executa a verificação de conteúdo antes do build Angular.
- `npm start` e `npm test` também geram o módulo antes da execução.

O parser é usado somente durante geração/build. A aplicação consome os dados por `MenuSource`; os Markdown não são empacotados como dados de runtime.
