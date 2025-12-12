# Politze

App de conscientização sobre a qualidade dos candidatos políticos para os brasileiros.

## 🚀 Funcionalidades

- ✅ Autenticação com Google e Facebook via NextAuth
- ✅ Visualização de políticos por região
- ✅ Sistema de ranking e pontuação
- ✅ Dados de transparência (orçamento, presença, propostas)
- ✅ Notícias relacionadas aos políticos
- ✅ Agenda de eventos e protestos públicos
- ✅ Interface moderna e responsiva com Tailwind CSS
- ✅ Banco de dados PostgreSQL com Prisma ORM

## 🛠️ Tecnologias

- **Framework**: Next.js 16 (Pages Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Autenticação**: NextAuth.js
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma
- **Deploy**: Vercel (recomendado)

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- NPM ou Yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/maikmb/politze.git
cd politze
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais:
- `DATABASE_URL`: String de conexão do PostgreSQL
- `NEXTAUTH_SECRET`: Chave secreta para NextAuth (gere com `openssl rand -base64 32`)
- `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`: Credenciais do Google OAuth
- `FACEBOOK_CLIENT_ID` e `FACEBOOK_CLIENT_SECRET`: Credenciais do Facebook OAuth

### Configurar Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a API "Google+ API"
4. Em "Credenciais", crie uma "ID do cliente OAuth 2.0"
5. Configure as URLs de redirecionamento:
   - `http://localhost:3000/api/auth/callback/google` (desenvolvimento)
   - `https://seu-dominio.com/api/auth/callback/google` (produção)

### Configurar Facebook OAuth

1. Acesse [Facebook Developers](https://developers.facebook.com/)
2. Crie um novo app
3. Adicione o produto "Facebook Login"
4. Configure as URLs de redirecionamento:
   - `http://localhost:3000/api/auth/callback/facebook` (desenvolvimento)
   - `https://seu-dominio.com/api/auth/callback/facebook` (produção)

4. Execute as migrações do banco de dados:
```bash
npx prisma migrate dev --name init
```

5. (Opcional) Popule o banco com dados iniciais:
```bash
npx prisma db seed
```

6. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

7. Acesse [http://localhost:3000](http://localhost:3000)

## 📦 Scripts Disponíveis

```bash
npm run dev          # Inicia o servidor de desenvolvimento
npm run build        # Cria a build de produção
npm start            # Inicia o servidor de produção
npm run lint         # Executa o ESLint
npx prisma studio    # Abre o Prisma Studio (GUI para o banco)
npx prisma migrate   # Gerencia migrações do banco
```

## 🗄️ Estrutura do Banco de Dados

O banco de dados inclui as seguintes tabelas:

- **User**: Usuários do sistema
- **Account**: Contas de OAuth (Google, Facebook)
- **Session**: Sessões de usuários
- **Politician**: Dados dos políticos
- **Rating**: Avaliações dos usuários sobre políticos
- **News**: Notícias relacionadas aos políticos
- **Event**: Eventos e protestos públicos

## 🎨 Estrutura do Projeto

```
politze/
├── components/          # Componentes React reutilizáveis
│   └── layout/         # Componentes de layout
├── lib/                # Utilitários e configurações
│   └── prisma.ts       # Cliente do Prisma
├── pages/              # Páginas Next.js (Pages Router)
│   ├── api/           # API Routes
│   ├── politicians/   # Páginas de políticos
│   ├── index.tsx      # Página inicial
│   ├── news.tsx       # Página de notícias
│   └── events.tsx     # Página de eventos
├── prisma/            # Schema e migrações do Prisma
├── public/            # Arquivos estáticos
├── styles/            # Estilos globais
└── types/             # Tipos TypeScript customizados
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Faça push do código para o GitHub
2. Importe o projeto no [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente no painel do Vercel
4. O deploy será automático!

### Outras Plataformas

O app pode ser deployado em qualquer plataforma que suporte Next.js:
- Railway
- Render
- AWS
- Google Cloud Platform
- Azure

## 📝 Licença

Este projeto está sob a licença ISC.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📧 Contato

Para dúvidas e sugestões, abra uma issue no GitHub.

---

Desenvolvido com ❤️ para promover a transparência política no Brasil
