# 🚀 Guia Rápido - Politze

## Início Rápido (Recomendado)

Execute o script de inicialização que faz tudo automaticamente:

```bash
./start.sh
```

O script irá:
1. ✅ Criar arquivo `.env` (se não existir)
2. ✅ Iniciar PostgreSQL com Docker Compose
3. ✅ Instalar dependências
4. ✅ Executar migrações do banco
5. ✅ Gerar Prisma Client
6. ✅ Popular banco (opcional)
7. ✅ Iniciar a aplicação

Acesse: http://localhost:3000

---

## Comandos Essenciais

### Usando o Makefile (Recomendado)

```bash
# Ver todos os comandos disponíveis
make help

# Setup completo do projeto
make setup

# Iniciar desenvolvimento
make dev

# Gerenciar Docker
make docker-up          # Iniciar PostgreSQL
make docker-down        # Parar PostgreSQL
make docker-logs        # Ver logs

# Automação
make automation         # Executar todos os scripts
make load-politicians   # Carregar políticos
make load-news         # Carregar notícias
make calculate-rankings # Calcular rankings

# Banco de dados
make migrate           # Executar migrações
make seed             # Popular com dados
make studio           # Abrir Prisma Studio
```

### Gerenciar Banco de Dados

```bash
# Iniciar PostgreSQL
docker-compose up -d

# Parar PostgreSQL
docker-compose down

# Ver logs do PostgreSQL
docker-compose logs -f

# Acessar o banco via Prisma Studio
npx prisma studio
```

### Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start
```

### Automação de Dados

```bash
# Executar todos os processos de automação
npm run automation

# Ou executar individualmente:
npm run load-politicians      # Carregar dados de políticos
npm run load-news             # Carregar notícias
npm run calculate-rankings    # Calcular rankings
```

### Banco de Dados

```bash
# Criar nova migração
npx prisma migrate dev --name nome_da_migracao

# Aplicar migrações em produção
npx prisma migrate deploy

# Gerar Prisma Client
npx prisma generate

# Popular banco com dados de exemplo
npx prisma db seed

# Reset completo do banco (CUIDADO!)
npx prisma migrate reset
```

---

## Estrutura de Pastas

```
politze/
├── components/           # Componentes React
│   └── Comments.tsx     # Sistema de comentários
├── pages/               # Páginas e rotas
│   ├── api/            # Endpoints da API
│   │   ├── comments/   # API de comentários
│   │   └── automation/ # API de automação
│   └── politicians/    # Páginas de políticos
├── scripts/            # Scripts de automação
│   ├── loadNews.ts
│   ├── loadPoliticians.ts
│   ├── calculateRankings.ts
│   └── runAutomation.ts
├── prisma/
│   ├── schema.prisma   # Schema do banco
│   └── seed.ts         # Dados iniciais
├── docker-compose.yml  # Config do PostgreSQL
└── start.sh           # Script de inicialização
```

---

## Novas Funcionalidades

### 1. Sistema de Comentários

Usuários logados podem deixar comentários nos perfis dos políticos.

**Componente**: `components/Comments.tsx`
**API**: `/api/comments/[politicianId]`

### 2. Automação de Dados

Scripts para carregar e atualizar dados automaticamente:

- Dados do Portal da Transparência
- Notícias de feeds RSS
- Cálculo automático de rankings

**Scripts**: `scripts/` directory
**Documentação**: Ver `AUTOMATION.md`

### 3. Docker Compose

PostgreSQL configurado e pronto para uso:

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
```

---

## Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```bash
# Banco de dados (já configurado para Docker)
DATABASE_URL="postgresql://politze:politze123@localhost:5432/politze"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gere-uma-chave-segura-aqui"

# OAuth (opcional para testes)
GOOGLE_CLIENT_ID="seu-google-client-id"
GOOGLE_CLIENT_SECRET="seu-google-client-secret"
FACEBOOK_CLIENT_ID="seu-facebook-client-id"
FACEBOOK_CLIENT_SECRET="seu-facebook-client-secret"
```

Gerar secret:
```bash
openssl rand -base64 32
```

---

## Troubleshooting

### Porta 5432 já em uso

```bash
# Parar serviço PostgreSQL local
sudo service postgresql stop

# Ou mudar porta no docker-compose.yml
ports:
  - "5433:5432"  # Use porta 5433 no host
```

### Erro ao conectar no banco

```bash
# Verificar se PostgreSQL está rodando
docker-compose ps

# Reiniciar PostgreSQL
docker-compose restart
```

### Migrações falhando

```bash
# Reset do banco (APAGA TODOS OS DADOS!)
npx prisma migrate reset

# Ou apenas gerar o client novamente
npx prisma generate
```

### Erro no npm install

```bash
# Limpar cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## Recursos Adicionais

- **Documentação Completa**: Ver `README.md`
- **Sistema de Automação**: Ver `AUTOMATION.md`
- **Schema do Banco**: Ver `prisma/schema.prisma`
- **Issues**: https://github.com/maikmb/politze/issues

---

## Próximos Passos

1. ✅ Configure o `.env` com suas credenciais OAuth
2. ✅ Execute `./start.sh` para iniciar
3. ✅ Acesse http://localhost:3000
4. ✅ Faça login com Google ou Facebook
5. ✅ Explore os perfis dos políticos
6. ✅ Deixe comentários!
7. ✅ Execute `npm run automation` para carregar dados

---

**Dúvidas?** Abra uma issue no GitHub!

Desenvolvido com ❤️ para promover transparência política 🇧🇷
