# Makefile para simplificar comandos comunes
.PHONY: help setup start stop status clean test deploy

# Variables
DOCKER_COMPOSE_DEV = docker-compose -f docker-compose.dev.yml
DOCKER_COMPOSE_TEST = docker-compose -f docker-compose.test.yml

# Default target
.DEFAULT_GOAL := help

# Colors for output
GREEN = \033[0;32m
YELLOW = \033[0;33m
RED = \033[0;31m
NC = \033[0m # No Color

help: ## 📋 Show this help
	@echo "$(GREEN)🚀 Booking Backend - Available Commands$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "$(YELLOW)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(GREEN)📚 Additional documentation in README.md$(NC)"

# Setup commands
setup: ## 🛠️  Initial setup for local development
	@echo "$(GREEN)🐳 Setting up local development with Docker...$(NC)"
	@npx tsx scripts/dev-helpers.ts setup

# Comentado para enfoque en desarrollo local
# setup: ## 🛠️  Initial setup - choose Docker or Railway
# 	@echo "$(GREEN)🤔 What do you prefer for development?$(NC)"
# 	@echo ""
# 	@echo "$(YELLOW)1. Local Docker$(NC) - PostgreSQL in local container"
# 	@echo "   ✅ Maximum control, no internet required"
# 	@echo "   ⚠️  Needs Docker Desktop"
# 	@echo ""
# 	@echo "$(YELLOW)2. Railway Cloud$(NC) - PostgreSQL in the cloud"
# 	@echo "   ✅ Super simple setup, no Docker needed"  
# 	@echo "   ⚠️  Needs internet and Railway account"
# 	@echo ""
# 	@read -p "Choose option (1 or 2): " option; \
# 	case $option in \
# 		1) make setup-docker;; \
# 		2) make setup-railway;; \
# 		*) echo "$(RED)Invalid option$(NC)" && exit 1;; \
# 	esac

setup-docker: ## 🐳 Setup with Local Docker
	@echo "$(GREEN)🐳 Setting up with Local Docker...$(NC)"
	@npx tsx scripts/dev-helpers.ts setup

# Comentado: Railway setup no necesario para desarrollo local
# setup-railway: ## ☁️ Setup con Railway Cloud
# 	@echo "$(GREEN)☁️ Configurando con Railway Cloud...$(NC)"
# 	@chmod +x scripts/railway-setup.ts
# 	@npm run railway:setup

start: ## ⚡ Start development (Docker + API)
	@echo "$(GREEN)🐳 Starting development environment...$(NC)"
	@$(DOCKER_COMPOSE_DEV) up -d
	@echo "$(GREEN)⚡ Starting API in development mode...$(NC)"
	@yarn dev

stop: ## 🛑 Stop everything
	@echo "$(YELLOW)🛑 Stopping services...$(NC)"
	@$(DOCKER_COMPOSE_DEV) down
	# @$(DOCKER_COMPOSE_TEST) down 2>/dev/null || true

status: ## 📊 View service status
	@echo "$(GREEN)📊 Docker services status:$(NC)"
	@$(DOCKER_COMPOSE_DEV) ps
	@echo ""
	@echo "$(GREEN)🗄️  Checking DB connection:$(NC)"
	@yarn db:verify

logs: ## 📋 View PostgreSQL logs
	@echo "$(GREEN)📋 PostgreSQL logs:$(NC)"
	@$(DOCKER_COMPOSE_DEV) logs -f postgres

# Database commands
db-reset: ## 🔄 Reset database (⚠️ deletes data)
	@echo "$(RED)⚠️  WARNING: This will delete all data$(NC)"
	@read -p "Continue? (y/N): " confirm && [ $$confirm = y ] || exit 1
	@yarn prisma:migrate reset --force
	@yarn prisma:seed
	@echo "$(GREEN)✅ Database reset$(NC)"

db-backup: ## 💾 Backup local database
	@echo "$(GREEN)💾 Creating backup...$(NC)"
	@npx tsx scripts/dev-helpers.ts db:backup

db-migrate: ## 🔀 Apply migrations
	@echo "$(GREEN)🔀 Applying migrations...$(NC)"
	@yarn prisma:migrate
	@echo "$(GREEN)✅ Migrations applied$(NC)"

db-seed: ## 🌱 Populate database with sample data
	@echo "$(GREEN)🌱 Populating database...$(NC)"
	@yarn prisma:seed
	@echo "$(GREEN)✅ Sample data added$(NC)"

db-studio: ## 🔍 Open Prisma Studio
	@echo "$(GREEN)🔍 Opening Prisma Studio...$(NC)"
	@npx prisma studio

# Docker commands
docker-up: ## 🐳 Start Docker services for development
	@echo "$(GREEN)🐳 Starting Docker services...$(NC)"
	@$(DOCKER_COMPOSE_DEV) up -d

docker-down: ## 🛑 Stop Docker services
	@echo "$(GREEN)🛑 Stopping Docker services...$(NC)"
	@$(DOCKER_COMPOSE_DEV) down

docker-restart: ## 🔄 Restart Docker services
	@echo "$(GREEN)🔄 Restarting Docker services...$(NC)"
	@$(DOCKER_COMPOSE_DEV) restart

docker-logs: ## 📋 View Docker logs
	@echo "$(GREEN)📋 Docker services logs:$(NC)"
	@$(DOCKER_COMPOSE_DEV) logs -f

docker-status: ## 📊 Docker services status
	@echo "$(GREEN)📊 Docker services status:$(NC)"
	@$(DOCKER_COMPOSE_DEV) ps

docker-clean: ## 🧹 Clean Docker (stopped containers)
	@echo "$(GREEN)🧹 Cleaning Docker...$(NC)"
	@docker system prune -f

docker-psql: ## 🗄️  Connect to PostgreSQL via Docker
	@echo "$(GREEN)🗄️  Connecting to PostgreSQL...$(NC)"
	@docker exec -it booking-postgres-dev psql -U booking_user -d booking_development

# Deployment commands (comentado para enfoque en desarrollo local)
# deploy-check: ## ✅ Verificar que todo está listo para deploy
# 	@echo "$(GREEN)✅ Verificando estado para deploy...$(NC)"
# 	@npm test
# 	@npm run build
# 	@echo "$(GREEN)✅ Listo para deploy$(NC)"

# deploy-preview: ## 🚀 Deploy preview a Railway
# 	@echo "$(GREEN)🚀 Creando preview deployment...$(NC)"
# 	@npx tsx scripts/dev-helpers.ts deploy:preview

# Development utilities
install: ## 📦 Install dependencies
	@echo "$(GREEN)📦 Installing dependencies...$(NC)"
	@yarn install

lint: ## 🔍 Run linter
	@echo "$(GREEN)🔍 Running linter...$(NC)"
	@yarn lint

lint-fix: ## 🔧 Run linter and fix automatically
	@echo "$(GREEN)🔧 Running linter with auto-fix...$(NC)"
	@yarn lint --fix

clean: ## 🧹 Clean temporary files and Docker
	@echo "$(YELLOW)🧹 Cleaning temporary files...$(NC)"
	@rm -rf dist/ coverage/ node_modules/.cache/
	@$(DOCKER_COMPOSE_DEV) down -v
	# @$(DOCKER_COMPOSE_TEST) down -v
	@docker system prune -f
	@echo "$(GREEN)✅ Cleanup completed$(NC)"

# Git helpers
git-setup: ## 📝 Setup inicial de Git
	@echo "$(GREEN)📝 Setting up Git...$(NC)"
	@git init
	@git add .
	@git commit -m "🚀 Initial commit - Backend with hexagonal architecture"
	@echo "$(GREEN)✅ Git configured$(NC)"
	@echo "$(YELLOW)💡 Next step: create repository on GitHub and run:$(NC)"
	@echo "   git remote add origin https://github.com/YOUR-USERNAME/booking-backend.git"
	@echo "   git push -u origin main"

# Environment helpers
env-example: ## 📄 Create .env from .env.example
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "$(GREEN)✅ .env file created from .env.example$(NC)"; \
		echo "$(YELLOW)💡 Edit .env with your configurations$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  .env already exists$(NC)"; \
	fi

env-check: ## 🔍 Check environment variables
	@echo "$(GREEN)🔍 Environment variables:$(NC)"
	@echo "NODE_ENV: $${NODE_ENV:-not set}"
	@echo "DATABASE_URL: $${DATABASE_URL:-not set}"
	@echo "API_KEY: $${API_KEY:-not set}"

# Quick shortcuts
quick-start: setup start ## 🚀 Setup + Start in one command

dev-check: ## 🔍 Check that everything is working
	@echo "$(GREEN)🔍 Checking development environment...$(NC)"
	@echo "$(YELLOW)📋 Docker status:$(NC)"
	@$(DOCKER_COMPOSE_DEV) ps || echo "$(RED)❌ Docker services not running$(NC)"
	@echo ""
	@echo "$(YELLOW)🗄️  Database connection:$(NC)"
	@yarn db:verify || echo "$(RED)❌ Database connection failed$(NC)"
	@echo ""
	@echo "$(YELLOW)📦 Dependencies:$(NC)"
	@yarn list --depth=0 2>/dev/null | head -3 || echo "$(RED)❌ Dependencies not installed$(NC)"
	@echo ""
	@echo "$(GREEN)✅ Development environment check completed$(NC)"

# Comentado para enfoque en desarrollo local
# full-test: ## 🧪 Test completo (limpia + testa + coverage)
# 	@$(MAKE) clean
# 	@$(MAKE) setup
# 	@$(MAKE) test-coverage

# prod-ready: ## 🎯 Check if ready for production
# 	@echo "$(GREEN)🎯 Checking production readiness...$(NC)"
# 	@$(MAKE) lint
# 	@$(MAKE) test-coverage
# 	@$(MAKE) build
# 	@echo "$(GREEN)✅ Ready for production!$(NC)"