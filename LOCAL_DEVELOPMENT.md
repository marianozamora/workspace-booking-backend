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
   - API Documentation: http://localhost:3000/docs
   - Database Admin (Adminer): http://localhost:8080 (if enabled)

4. **Test the API:**

   ```bash
   # Test health endpoint (no API key required)
   curl http://localhost:3000/health

   # Get API information (no API key required)
   curl http://localhost:3000/api

   # Test API v1 endpoints (requires API key)
   curl -H "X-API-Key: your-secure-api-key-here-change-in-production" \
        http://localhost:3000/api/v1/spaces
   ```

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

## API Usage

The API requires authentication for all endpoints except `/health`. Include the API key in your requests:

```bash
# Get all spaces
curl -H "X-API-Key: your-secure-api-key-here-change-in-production" \
     http://localhost:3000/api/v1/spaces

# Get all bookings
curl -H "X-API-Key: your-secure-api-key-here-change-in-production" \
     http://localhost:3000/api/v1/bookings

# Create a booking
curl -X POST \
     -H "X-API-Key: your-secure-api-key-here-change-in-production" \
     -H "Content-Type: application/json" \
     -d '{"spaceId":"space-id","clientEmail":"test@example.com","date":"2025-09-14","startTime":"09:00","endTime":"10:00"}' \
     http://localhost:3000/api/v1/bookings
```

**API Versioning:**

- Current version: **v1**
- Base path: `/api/v1/`
- Future versions will be available at `/api/v2/`, etc.

**API Key Location:**

- Environment variable: `API_KEY` in `.env` file
- Default value: `your-secure-api-key-here-change-in-production`
- Header name: `X-API-Key`

## Troubleshooting

### API Authentication Issues

```bash
# Error: {"error":"Unauthorized","message":"Invalid or missing API Key"}
# Solution: Include the X-API-Key header in your request

# Check your API key in .env file
cat .env | grep API_KEY

# Test with correct API key
curl -H "X-API-Key: your-secure-api-key-here-change-in-production" \
     http://localhost:3000/api/v1/spaces
```

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
