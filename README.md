# Store Center — Gestão da Assistência

Sistema demonstrativo migrado do Floot para **React + TypeScript + Vite**, mantendo a identidade visual azul, os módulos de atendimento e a navegação responsiva.

## Estado
- **Fonte:** código migrado para `src/`. Alterações futuras devem ocorrer neste repositório.
- **Build:** `npm run build` passou no GitHub Actions em 12/11/2026.
- **Publicação:** GitHub Pages **ainda não habilitado** pelo administrador do repositório.
- **Dados:** ainda armazenados no `localStorage` do navegador; **não usar dados reais de clientes**.
- **Firebase:** configuração inicial incluída em `src/lib/firebase.ts`, `firebase.json` e `firestore.rules`; regras **deny all**, sem integração de dados ativa.

## Habilitar GitHub Pages (uma vez)
1. Abra **Settings → Pages** neste repositório.
2. Em **Build and deployment → Source**, escolha **GitHub Actions** e salve.
3. Abra **Actions → Publicar Store Center (demo)** e clique **Run workflow** (ou faça novo commit).
4. Confirme que build e deploy ficaram verdes.
5. Depois disso, o endereço será `https://eulernasc.github.io/store_center/`.

A automação se encontra em `.github/workflows/pages.yml`. A primeira ativação do Pages não pôde ser feita automaticamente: o token do Actions recebeu `Resource not accessible by integration` ao tentar criar o site.

## Desenvolvimento local
```bash
npm install
npm run dev
npm run build
```

## Ajustes incluídos no código
- Busca e edição de serviços, com confirmação antes de substituir nome duplicado; mostra valor atual.
- Catálogo de marcas e modelos, com busca, cadastro em área própria e cadastro rápido na OS.
- Checklist técnico configurável por item: Sim, Não e Não testado, além de observação.
- Recebimento parcial ou integral da OS com valor e meio de pagamento; lançamentos integrados ao financeiro demonstrativo.

## Firebase
O aplicativo não depende do Firebase para abrir e testar. A integração de **Auth + Firestore** será feita separadamente, com dados vinculados à loja, validação de permissões e migração dos cadastros existentes. Não publique regras permissivas: `firestore.rules` já começa com acesso negado.

Para publicar pelo Firebase Hosting, após criar e configurar um projeto e credenciais próprias:
```bash
npm run build
firebase login
firebase use --add
firebase deploy --only hosting
```

**Importante:** isso publica os arquivos estáticos, não cria banco compartilhado nem autenticação por si só.
