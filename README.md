# Workspace Booking Backend

Workspace reservation management system - REST API built with Fastify, TypeScript, and Prisma.

## ✨ Features

- 🏢 **Space Management**: CRUD operations for workspace spaces
- 📅 **Booking System**: Create, manage, and cancel reservations
- 🔐 **API Authentication**: Secure API key-based authentication
- 📚 **API Documentation**: Interactive documentation with Swagger/OpenAPI
- 🗄️ **Database**: PostgreSQL with Prisma ORM
- 🏗️ **Hexagonal Architecture**: Clean and maintainable design
- 🧪 **Testing**: Optimized test suite with Jest
- 🚀 **Deployment**: Configured for Railway with health checks
- 🔄 **API Versioning**: v1 API with future support

## 🚀 Quick Start

### Local Development

```bash
# Clone repository
git clone <repository-url>
cd workspace-booking-backend

# Install dependencies
yarn install

# Configure environment variables
cp .env.example .env

# Setup database
yarn prisma:migrate
yarn prisma:seed

# Start development server
yarn dev

# Server will be available at http://localhost:3000
```

**Alternative with Make:**
```bash
# Complete setup and start (includes Docker PostgreSQL)
make start

# This will setup everything and start the development environment
```

### Production (Railway)

1. **Fork/Clone** this repository
2. **Connect to Railway**: Import project from GitHub
3. **Configure environment variables** (see Environment Variables section)
4. **Automatic deploy**: Railway detects and deploys automatically

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

**Development:**
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/workspace_booking"
API_KEY="SECRET"
NODE_ENV="development"
PORT=3000
HOST="0.0.0.0"
```

**Production (Railway):**
```bash
DATABASE_URL="<railway-postgresql-url>"
API_KEY="<your-secure-api-key>"
NODE_ENV="production"
FRONTEND_URL="https://your-frontend.vercel.app"
```

## 🏗️ Available Scripts

**Development:**
```bash
yarn dev              # Development server
yarn build            # Compile TypeScript
yarn test             # Run tests
yarn test:watch       # Tests in watch mode
yarn lint             # Check code
yarn format           # Format code
```

**Database:**
```bash
yarn prisma:migrate   # Apply migrations
yarn prisma:seed      # Populate with sample data
yarn prisma:studio    # Open Prisma Studio
yarn db:verify        # Verify connection
```

**Production:**
```bash
yarn start            # Start server (with Railway check)
yarn start:prod       # Start in production mode
yarn railway:setup    # Complete Railway setup
```

**Make Commands:**
```bash
make start            # Setup and start complete development environment
make stop             # Stop all services
make setup            # Initial project setup with Docker
make help             # Show all available make commands
```

## 🏗️ Architecture

This project follows **Hexagonal Architecture** (Ports and Adapters):

```
src/
├── domain/              # Business logic and entities
│   ├── entities/        # Domain entities (Space, Booking)
│   ├── services/        # Domain services
│   └── ports/           # Interfaces (repositories, services)
├── application/         # Use cases and DTOs
│   ├── use-cases/       # Application logic
│   └── dtos/            # Data transfer objects
└── infrastructure/      # External adapters
    ├── database/        # Prisma implementations
    └── web/             # Controllers and Fastify routes
```

## 🧪 Testing

```bash
# Run all tests
yarn test

# Tests with coverage
yarn test:coverage

# Tests in watch mode
yarn test:watch
```

**Tests included:**
- ✅ **Authentication**: API key verification
- ✅ **CRUD Spaces**: Creation, reading, and deletion
- ✅ **CRUD Bookings**: Complete lifecycle
- ✅ **Validations**: Required fields and business logic
- ✅ **Health Checks**: Monitoring endpoints

## 🛠️ Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Fastify 4.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL
- **ORM**: Prisma 5.x
- **Logging**: Pino
- **Validation**: Zod
- **Testing**: Jest + Supertest
- **Documentation**: Swagger/OpenAPI
- **Deploy**: Railway
- **CI**: TypeScript + ESLint + Prettier

## 🚀 Deployment

**Railway (Recommended):**
1. Connect repository to Railway
2. Configure environment variables
3. Automatic deploy with health checks
4. URL: `https://workspace-booking-backend-production.up.railway.app`

**Docker:**
```bash
docker build -t workspace-booking-api .
docker run -p 3000:3000 workspace-booking-api
```

## 📊 Monitoring

- **Health Check**: `GET /health`
- **API Info**: `GET /api`
- **Documentation**: `GET /docs`
- **Debug Info**: `GET /debug` (development)

## 📜 License

MIT License - see [LICENSE](./LICENSE) file for details.

---

**Developed with AI** - See [AI.md](./AI.md) for details about artificial intelligence usage in development.
