.PHONY: help install dev build start clean docker-up docker-down docker-logs migrate seed studio automation

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m # No Color

help: ## Mostra este menu de ajuda
	@echo "$(BLUE)Politze - Comandos Disponíveis$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

install: ## Instala todas as dependências
	@echo "$(YELLOW)📦 Instalando dependências...$(NC)"
	npm install

dev: ## Inicia servidor de desenvolvimento
	@echo "$(GREEN)🚀 Iniciando servidor de desenvolvimento...$(NC)"
	npm run dev

build: ## Cria build de produção
	@echo "$(YELLOW)🔨 Criando build...$(NC)"
	npm run build

start: ## Inicia servidor de produção
	@echo "$(GREEN)🚀 Iniciando servidor de produção...$(NC)"
	npm start

clean: ## Remove node_modules e .next
	@echo "$(YELLOW)🧹 Limpando arquivos...$(NC)"
	rm -rf node_modules .next

docker-up: ## Inicia PostgreSQL com Docker Compose
	@echo "$(GREEN)🐳 Iniciando PostgreSQL...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)✅ PostgreSQL iniciado!$(NC)"

docker-down: ## Para PostgreSQL
	@echo "$(YELLOW)🛑 Parando PostgreSQL...$(NC)"
	docker-compose down

docker-logs: ## Mostra logs do PostgreSQL
	docker-compose logs -f

migrate: ## Executa migrações do banco de dados
	@echo "$(YELLOW)🗄️  Executando migrações...$(NC)"
	npx prisma migrate dev

migrate-deploy: ## Aplica migrações em produção
	@echo "$(YELLOW)🗄️  Aplicando migrações...$(NC)"
	npx prisma migrate deploy

seed: ## Popula banco com dados de exemplo
	@echo "$(GREEN)🌱 Populando banco de dados...$(NC)"
	npx prisma db seed

studio: ## Abre Prisma Studio
	@echo "$(BLUE)📊 Abrindo Prisma Studio...$(NC)"
	npx prisma studio

automation: ## Executa todos os scripts de automação
	@echo "$(BLUE)🤖 Executando automação completa...$(NC)"
	npm run automation

load-politicians: ## Carrega dados de políticos
	@echo "$(BLUE)👥 Carregando dados de políticos...$(NC)"
	npm run load-politicians

load-news: ## Carrega notícias
	@echo "$(BLUE)🗞️  Carregando notícias...$(NC)"
	npm run load-news

calculate-rankings: ## Calcula rankings
	@echo "$(BLUE)📊 Calculando rankings...$(NC)"
	npm run calculate-rankings

setup: docker-up install migrate seed ## Setup completo do projeto
	@echo "$(GREEN)✅ Setup completo!$(NC)"
	@echo "$(GREEN)Execute 'make dev' para iniciar a aplicação$(NC)"

reset-db: ## Reset completo do banco (CUIDADO!)
	@echo "$(YELLOW)⚠️  ATENÇÃO: Isso irá apagar todos os dados!$(NC)"
	@read -p "Tem certeza? [s/N] " confirm && [ "$$confirm" = "s" ] && npx prisma migrate reset || echo "Cancelado"

lint: ## Executa o linter
	@echo "$(YELLOW)🔍 Executando linter...$(NC)"
	npm run lint

test: ## Executa testes (quando disponível)
	@echo "$(YELLOW)🧪 Executando testes...$(NC)"
	@echo "Testes não implementados ainda"

# Default target
.DEFAULT_GOAL := help
