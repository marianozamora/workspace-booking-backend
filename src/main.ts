import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { PrismaClient } from "@prisma/client";

// Infrastructure
import {
	PrismaSpacesRepository,
	PrismaBookingsRepository,
	DateServiceImpl,
	PinoLogger,
} from "@/infrastructure/database";

// Domain services
import { BookingValidationService } from "@/domain/services";

// Use cases
import { SpaceUseCases, BookingUseCases } from "@/application/use-cases";

// Web controllers
import {
	SpacesController,
	BookingsController,
	setupRoutes,
} from "@/infrastructure/web";

// Configuration
const PORT = parseInt(process.env.PORT || "3000");
const HOST = process.env.HOST || "0.0.0.0";
const DATABASE_URL =
	process.env.DATABASE_URL ||
	"postgresql://user:password@localhost:5432/bookings";

// Factory to create the application with all dependencies
export async function createApp() {
	// Initialize Fastify
	const fastify = Fastify({
		logger: process.env.NODE_ENV === "development",
	});

	// Plugins
	await fastify.register(cors, {
		origin:
			process.env.NODE_ENV === "production"
				? [process.env.FRONTEND_URL || "https://your-frontend.vercel.app"]
				: true,
	});

	await fastify.register(swagger, {
		openapi: {
			openapi: "3.0.0",
			info: {
				title: "Bookings API",
				description: "Workspace booking management system",
				version: "1.0.0",
			},
			servers: [
				{
					url:
						process.env.NODE_ENV === "production"
							? process.env.RAILWAY_STATIC_URL ||
							  process.env.API_URL ||
							  "https://your-api.railway.app"
							: `http://localhost:${PORT}`,
				},
			],
			components: {
				securitySchemes: {
					apiKey: {
						type: "apiKey",
						name: "X-API-Key",
						in: "header",
					},
				},
			},
			security: [{ apiKey: [] }],
		},
	});

	await fastify.register(swaggerUi, {
		routePrefix: "/docs",
		uiConfig: {
			docExpansion: "list",
			deepLinking: false,
		},
	});

	// Dependency injection - Infrastructure layer
	const prisma = new PrismaClient({
		datasourceUrl: DATABASE_URL,
		log:
			process.env.NODE_ENV === "development"
				? ["query", "info", "warn", "error"]
				: ["error"],
	});

	const logger = new PinoLogger();
	const dateService = new DateServiceImpl();

	// Repositories
	const spacesRepository = new PrismaSpacesRepository(prisma);
	const bookingsRepository = new PrismaBookingsRepository(prisma);

	// Domain Services
	const bookingValidationService = new BookingValidationService(
		bookingsRepository,
		spacesRepository,
		dateService
	);

	// Use Cases
	const spaceUseCases = new SpaceUseCases(spacesRepository, logger);

	const bookingUseCases = new BookingUseCases(
		bookingsRepository,
		spacesRepository,
		bookingValidationService,
		logger
	);

	// Controllers
	const spacesController = new SpacesController(spaceUseCases);
	const bookingsController = new BookingsController(bookingUseCases);

	// Configure routes
	setupRoutes(fastify, spacesController, bookingsController);

	// Health check route
	fastify.get("/health", async () => {
		return {
			status: "ok",
			timestamp: new Date().toISOString(),
			version: "1.0.0",
			database: "connected",
		};
	});

	// API info route
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

	// Hook to close connections
	fastify.addHook("onClose", async () => {
		await prisma.$disconnect();
		logger.info("Application closed correctly");
	});

	// Global error handling
	fastify.setErrorHandler(async (error, request, reply) => {
		logger.error("Unhandled error", error, {
			method: request.method,
			url: request.url,
			headers: request.headers,
		});

		// Don't expose error details in production
		const message =
			process.env.NODE_ENV === "production"
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

// Function to initialize the database
async function initializeDatabase() {
	const prisma = new PrismaClient();

	try {
		await prisma.$connect();
		console.log("✅ Database connected successfully");

		// Verify tables exist
		await prisma.space.findFirst();
		await prisma.booking.findFirst();
		console.log("✅ Database schema verified");
	} catch (error) {
		console.error("❌ Error connecting to database:", error);
		throw error; // Re-throw to let the caller handle it
	} finally {
		// Always disconnect this test instance
		await prisma.$disconnect();
	}
}

// Main function to start the server
async function start() {
	try {
		// Verify critical environment variables
		const requiredEnvVars = ["DATABASE_URL", "API_KEY"];
		const missingVars = requiredEnvVars.filter(
			(varName) => !process.env[varName]
		);

		if (missingVars.length > 0) {
			console.error(
				`❌ Missing environment variables: ${missingVars.join(", ")}`
			);
			process.exit(1);
		}

		// Initialize database
		try {
			await initializeDatabase();
		} catch (error) {
			console.error("❌ Database initialization failed:", error);
			process.exit(1);
		}

		// Create and configure the application
		const app = await createApp();

		// Start server
		await app.listen({ port: PORT, host: HOST });

		console.log(`
🚀 Server started successfully!
📍 Address: http://${HOST}:${PORT}
📚 Documentation: http://${HOST}:${PORT}/docs
🏥 Health check: http://${HOST}:${PORT}/health
🔑 API Key required in header: X-API-Key
    `);
	} catch (error) {
		console.error("❌ Error starting server:", error);
		process.exit(1);
	}
}

// Handle signals for clean shutdown
process.on("SIGINT", () => {
	console.log("\n👋 Closing server...");
	process.exit(0);
});

process.on("SIGTERM", () => {
	console.log("\n👋 Closing server...");
	process.exit(0);
});

// Handle uncaught errors
process.on("unhandledRejection", (reason, promise) => {
	console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
	process.exit(1);
});

process.on("uncaughtException", (error) => {
	console.error("❌ Uncaught Exception:", error);
	process.exit(1);
});

// Start the application if this file is executed directly
if (require.main === module) {
	start();
}
