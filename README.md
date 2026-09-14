# Portfólio — Matheus Amorim

Site pessoal com os cases dos meus projetos em dados, IA, web e infraestrutura. Bilíngue (PT/EN), gerado estaticamente e publicado na Vercel.

## Stack

- Next.js (App Router) e TypeScript strict
- Tailwind CSS v4, com os tokens em `@theme` no `globals.css`
- MDX para o conteúdo dos cases, validado com Zod na build
- next-intl para i18n
- Vitest para os testes
- Resend para o formulário de contato

## Decisões

Cada uma tem um custo, e o custo está anotado no código onde a decisão vive.

- **Conteúdo versionado, sem CMS.** Cada case é um `.mdx` em `src/content/projects/`. O frontmatter é validado com Zod na build: schema inválido quebra a build, de propósito.
- **Os dois idiomas no mesmo arquivo.** O corpo é separado pelos marcadores `<!-- lang:pt -->` e `<!-- lang:en -->`. O loader compila só o idioma pedido, e o cliente não recebe runtime de MDX. Um arquivo por idioma era o risco de uma versão desatualizar a outra.
- **Animação em CSS, sem biblioteca.** O hero contém o LCP; animá-lo por JavaScript faria o elemento esperar a hidratação. A entrada dos blocos ao rolar usa `IntersectionObserver` e uma transição de CSS. `prefers-reduced-motion` desliga toda animação, não só reduz.
- **Contraste testado.** `src/lib/palette.test.ts` lê o `globals.css` real e falha se algum par texto/fundo cair abaixo de WCAG AA.
- **Capas geradas na build.** Cada case ganha uma imagem tipográfica de 1200×630 em `/covers/<slug>.png`, servida por um route handler e usada no card e no Open Graph. Um arquivo estático em `public/covers/` tem precedência e substitui a capa gerada sem tocar no frontmatter.
- **Formulário de contato com três barreiras.** Honeypot no cliente, validação com Zod e limite de requisições por IP no servidor. Sem a chave do provedor, o formulário avisa que está indisponível e aponta para o e-mail.
- **CSS inline no HTML.** `experimental.inlineCss` tira uma ida à rede do caminho crítico. Quase todo acesso a um portfólio é o primeiro, então o cache de stylesheet que se perde quase nunca seria aproveitado.

## Como rodar

```bash
corepack enable              # Yarn 4, declarado em packageManager
yarn install
cp .env.example .env.local   # opcional: sem ele, só o formulário fica indisponível
yarn dev
```

Verificação, na mesma ordem do CI:

```bash
yarn lint
yarn typecheck
yarn test
yarn build     # valida o frontmatter de todos os cases
```

## Estrutura

```
src/
├── app/[locale]/        # rotas por idioma: home, projetos/[slug], sobre, contato
├── app/api/contato/     # route handler do formulário
├── app/covers/[slug]/   # capa PNG de cada case, gerada na build
├── components/          # ui, layout, sections, motion, mdx, seo
├── content/projects/    # um .mdx por case, PT e EN no mesmo arquivo
├── content/i18n/        # texto de interface, pt.json e en.json
└── lib/                 # loader, schema, contraste, cena do gráfico, contato
```

## Conteúdo

Um case novo parte de `src/content/projects/_template.mdx` e segue quatro seções: Contexto, Decisões técnicas, Resultado, Aprendizados. Categoria é dado (`dados-ia`, `web`, `infra`); a aba que a exibe é apresentação, mapeada em `src/lib/tabs.ts`.
