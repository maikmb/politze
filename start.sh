#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Iniciando Politze...${NC}\n"

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env não encontrado. Criando a partir do .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Arquivo .env criado. Por favor, configure as variáveis de ambiente.${NC}"
fi

# Start Docker Compose
echo -e "${GREEN}🐳 Iniciando PostgreSQL com Docker Compose...${NC}"
docker-compose up -d

# Wait for PostgreSQL to be ready
echo -e "${YELLOW}⏳ Aguardando PostgreSQL ficar pronto...${NC}"
until docker-compose exec -T postgres pg_isready -U politze > /dev/null 2>&1; do
    echo -e "${YELLOW}   Aguardando banco de dados...${NC}"
    sleep 2
done
echo -e "${GREEN}✅ PostgreSQL está pronto!${NC}"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${GREEN}📦 Instalando dependências...${NC}"
    npm install
fi

# Run Prisma migrations
echo -e "${GREEN}🗄️  Executando migrações do banco de dados...${NC}"
npx prisma migrate dev --name init

# Generate Prisma Client
echo -e "${GREEN}🔧 Gerando Prisma Client...${NC}"
npx prisma generate

# Seed database (if needed)
echo -e "${YELLOW}🌱 Deseja popular o banco de dados com dados de exemplo? (s/n)${NC}"
read -r response
if [[ "$response" =~ ^([sS][iI]?[mM]?|[yY][eE]?[sS]?)$ ]]; then
    echo -e "${GREEN}🌱 Populando banco de dados...${NC}"
    npx prisma db seed
fi

# Start Next.js development server
echo -e "${GREEN}🎉 Iniciando aplicação Next.js...${NC}"
echo -e "${GREEN}📱 Acesse: http://localhost:3000${NC}\n"

npm run dev
