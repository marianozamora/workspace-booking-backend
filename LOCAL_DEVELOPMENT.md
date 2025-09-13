# 🚀 Local Development Quick Start

## Prerequisites

- Docker Desktop installed and running
- Node.js 18+ installed
- Yarn package manager installed
- Git

## Quick Setup (First Time)

1. **Clone and setup:**

   ```bash
   git clone <repository-url>
   cd workspace-booking-backend
   make setup
   ```

2. **Start development:**

   ```bash
   make start
   ```

3. **Open your browser:**
   - API: http://localhost:3000
   - Database Admin (Adminer): http://localhost:8080 (if enabled)

## Daily Development Commands

```bash
# Start everything
make start

# View logs
make logs

# Check status
make status

# Stop everything
make stop

# Reset database (removes all data)
make db-reset

# Create database backup
make db-backup

# View all available commands
make help
```

## Docker Commands

```bash
# Docker-specific commands
make docker-up      # Start just PostgreSQL
make docker-down    # Stop PostgreSQL
make docker-logs    # View PostgreSQL logs
make docker-psql    # Connect to PostgreSQL directly
```

## Troubleshooting

### Database connection issues

```bash
# Check if Docker is running
docker ps

# Check database connection
yarn db:verify

# View database logs
make docker-logs
```

### Port conflicts

- PostgreSQL uses port 5432
- API uses port 3000
- Adminer uses port 8080

If you have conflicts, stop other services or modify the ports in `docker-compose.dev.yml`.

## Project Structure

```
├── src/
│   ├── domain/          # Business logic
│   ├── application/     # Use cases
│   └── infrastructure/  # External adapters
├── scripts/            # Development helpers
├── prisma/            # Database schema
└── docker-compose.dev.yml  # Local database
```

## Next Steps

- After setup, the API will be available at http://localhost:3000
- Check the API documentation (when available)
- Use `make db-studio` to open Prisma Studio for database management
