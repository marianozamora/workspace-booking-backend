# workspace-booking-backend

Workspace reservation management system - REST API built with Fastify, TypeScript, and Prisma.

## ✨ Features

- 🏢 **Space Management**: CRUD operations for workspace spaces
- 📅 **Booking System**: Create, manage, and cancel reservations
- 🔐 **API Authentication**: Secure API key-based authentication
- 📚 **API Documentation**: Interactive Swagger/OpenAPI docs
- 🗄️ **Database**: PostgreSQL with Prisma ORM
- 🐳 **Docker Ready**: Multi-stage Docker builds
- 🚀 **Railway Deploy**: One-click deployment to Railway
- 🔄 **API Versioning**: v1 API with future-proof versioning

## 🚀 Quick Start

### Local Development

See [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md) for detailed setup instructions.

```bash
git clone <repository-url>
cd workspace-booking-backend
make setup
make start
```

### Railway Deployment

See [RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md) for production deployment guide.

## 📋 API Endpoints

**Public:**

- `GET /health` - Health check
- `GET /api` - API information and versions
- `GET /docs` - Interactive API documentation

**Authenticated (requires X-API-Key header):**

- `GET /api/v1/spaces` - List all spaces
- `POST /api/v1/spaces` - Create new space
- `GET /api/v1/bookings` - List all bookings
- `POST /api/v1/bookings` - Create new booking
- `PATCH /api/v1/bookings/:id/cancel` - Cancel booking

## 🔧 Environment Variables

```bash
DATABASE_URL="postgresql://user:pass@host:port/db"
API_KEY="your-secure-api-key"
NODE_ENV="development|production"
PORT=3000
HOST="0.0.0.0"
LOG_LEVEL="debug|info|warn|error"
FRONTEND_URL="https://your-frontend.com"
```

## 🏗️ Architecture

This project follows Hexagonal Architecture (Ports and Adapters):

```
src/
├── domain/          # Business logic and entities
├── application/     # Use cases and DTOs
└── infrastructure/  # External adapters (web, database)
```

## 🛠️ Tech Stack

- **Runtime**: Node.js 22
- **Framework**: Fastify
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Logging**: Pino
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker
- **Deployment**: Railway

## 📜 License

MIT License - see [LICENSE](./LICENSE) file for details.
