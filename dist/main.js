"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const client_1 = require("@prisma/client");
const database_1 = require("./infrastructure/database");
const services_1 = require("./domain/services");
const use_cases_1 = require("./application/use-cases");
const web_1 = require("./infrastructure/web");
const PORT = parseInt(process.env.PORT || "3000");
const HOST = process.env.HOST || "0.0.0.0";
const DATABASE_URL = process.env.DATABASE_URL ||
    "postgresql://user:password@localhost:5432/bookings";
async function createApp() {
    const fastify = (0, fastify_1.default)({
        logger: process.env.NODE_ENV === "development",
    });
    await fastify.register(cors_1.default, {
        origin: process.env.NODE_ENV === "production"
            ? [process.env.FRONTEND_URL || "https://your-frontend.vercel.app"]
            : true,
    });
    await fastify.register(swagger_1.default, {
        openapi: {
            openapi: "3.0.0",
            info: {
                title: "Workspace Booking API",
                description: `
# Workspace Booking Management System

A comprehensive REST API for managing workspace reservations and bookings.

## Features
- **Space Management**: Create, read, update, and delete workspace spaces
- **Booking Management**: Full CRUD operations for workspace reservations
- **Authentication**: Secure API key-based authentication
- **Filtering & Pagination**: Advanced filtering and pagination support
- **Business Logic**: Automatic conflict detection and validation

## Authentication
All endpoints (except health checks) require an API key to be provided in the \`X-API-Key\` header.

## Rate Limiting
The API implements rate limiting to ensure fair usage. Please refer to response headers for current limits.

## Error Handling
The API returns consistent error responses with appropriate HTTP status codes and descriptive messages.
				`,
                version: "1.0.0",
                contact: {
                    name: "API Support",
                    email: "support@workspace-booking.com",
                },
                license: {
                    name: "MIT",
                    url: "https://opensource.org/licenses/MIT",
                },
            },
            servers: [
                {
                    url: process.env.NODE_ENV === "production"
                        ? "https://workspace-booking-backend-production.up.railway.app"
                        : `http://localhost:${PORT}`,
                    description: process.env.NODE_ENV === "production"
                        ? "Production server"
                        : "Development server",
                },
            ],
            components: {
                securitySchemes: {
                    ApiKeyAuth: {
                        type: "apiKey",
                        name: "X-API-Key",
                        in: "header",
                        description: "API key for authentication. Contact support to obtain your API key.",
                    },
                },
                schemas: {},
            },
            security: [
                {
                    ApiKeyAuth: [],
                },
            ],
            tags: [
                {
                    name: "Health",
                    description: "Health check and monitoring endpoints",
                },
                {
                    name: "Information",
                    description: "API information and metadata",
                },
                {
                    name: "Development",
                    description: "Development and debugging endpoints",
                },
                {
                    name: "Spaces",
                    description: "Workspace space management operations",
                },
                {
                    name: "Bookings",
                    description: "Workspace booking and reservation operations",
                },
            ],
        },
    });
    await fastify.register(swagger_ui_1.default, {
        routePrefix: "/docs",
        uiConfig: {
            docExpansion: "list",
            deepLinking: false,
        },
    });
    const prisma = new client_1.PrismaClient({
        datasourceUrl: DATABASE_URL,
        log: process.env.NODE_ENV === "development"
            ? ["query", "info", "warn", "error"]
            : ["error"],
    });
    const logger = new database_1.PinoLogger();
    const dateService = new database_1.DateServiceImpl();
    const spacesRepository = new database_1.PrismaSpacesRepository(prisma);
    const bookingsRepository = new database_1.PrismaBookingsRepository(prisma);
    const bookingValidationService = new services_1.BookingValidationService(bookingsRepository, spacesRepository, dateService);
    const spaceUseCases = new use_cases_1.SpaceUseCases(spacesRepository, logger);
    const bookingUseCases = new use_cases_1.BookingUseCases(bookingsRepository, spacesRepository, bookingValidationService, logger);
    const spacesController = new web_1.SpacesController(spaceUseCases);
    const bookingsController = new web_1.BookingsController(bookingUseCases, spaceUseCases);
    (0, web_1.setupRoutes)(fastify, spacesController, bookingsController);
    fastify.get("/health", async () => {
        return {
            status: "ok",
            timestamp: new Date().toISOString(),
            version: "1.0.0",
            database: "connected",
        };
    });
    fastify.get("/api", async () => {
        return {
            name: "Workspace Booking API",
            description: "Workspace reservation management system",
            version: "1.0.0",
            apiVersions: {
                current: "v1",
                available: ["v1"],
                deprecated: [],
            },
            endpoints: {
                health: "/health",
                docs: "/docs",
                api: {
                    v1: {
                        base: "/api/v1",
                        spaces: "/api/v1/spaces",
                        bookings: "/api/v1/bookings",
                    },
                },
            },
            authentication: {
                type: "API Key",
                header: "X-API-Key",
                required: true,
            },
        };
    });
    fastify.get("/debug", async () => {
        try {
            return {
                env: process.env.NODE_ENV,
                port: PORT,
                host: HOST,
                timestamp: new Date().toISOString(),
                routes: fastify.printRoutes(),
            };
        }
        catch (error) {
            return {
                error: error instanceof Error ? error.message : String(error),
                timestamp: new Date().toISOString(),
            };
        }
    });
    fastify.addHook("onClose", async () => {
        await prisma.$disconnect();
        logger.info("Application closed correctly");
    });
    fastify.setErrorHandler(async (error, request, reply) => {
        logger.error("Unhandled error", error, {
            method: request.method,
            url: request.url,
            headers: request.headers,
        });
        const message = process.env.NODE_ENV === "production"
            ? "Internal server error"
            : error.message;
        return reply.code(500).send({
            error: "Internal Server Error",
            message,
            timestamp: new Date().toISOString(),
        });
    });
    return fastify;
}
async function initializeDatabase() {
    const prisma = new client_1.PrismaClient();
    try {
        await prisma.$connect();
        console.log("✅ Database connected successfully");
        await prisma.space.findFirst();
        await prisma.booking.findFirst();
        console.log("✅ Database schema verified");
    }
    catch (error) {
        console.error("❌ Error connecting to database:", error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
}
async function start() {
    try {
        const requiredEnvVars = ["DATABASE_URL", "API_KEY"];
        const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
        if (missingVars.length > 0) {
            console.error(`❌ Missing environment variables: ${missingVars.join(", ")}`);
            process.exit(1);
        }
        try {
            await initializeDatabase();
        }
        catch (error) {
            console.error("❌ Database initialization failed:", error);
            process.exit(1);
        }
        const app = await createApp();
        await app.listen({ port: PORT, host: HOST });
        console.log(`
🚀 Server started successfully!
📍 Address: http://${HOST}:${PORT}
📚 Documentation: http://${HOST}:${PORT}/docs
🏥 Health check: http://${HOST}:${PORT}/health
🔑 API Key required in header: X-API-Key
    `);
    }
    catch (error) {
        console.error("❌ Error starting server:", error);
        process.exit(1);
    }
}
process.on("SIGINT", () => {
    console.log("\n👋 Closing server...");
    process.exit(0);
});
process.on("SIGTERM", () => {
    console.log("\n👋 Closing server...");
    process.exit(0);
});
process.on("unhandledRejection", (reason, promise) => {
    console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
});
process.on("uncaughtException", error => {
    console.error("❌ Uncaught Exception:", error);
    process.exit(1);
});
if (require.main === module) {
    start();
}
