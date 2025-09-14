import { FastifyInstance } from "fastify";
import { SpacesController } from "./SpacesController";
import { BookingsController } from "./BookingsController";
import { authenticateApiKey } from "./middleware";
import { RouteHelper } from "./RouteHelper";

// Route configuration
export function setupRoutes(
	fastify: FastifyInstance,
	spacesController: SpacesController,
	bookingsController: BookingsController
) {
	// Authentication middleware for all routes
	fastify.addHook("preHandler", authenticateApiKey);

	// API v1 routes
	// Spaces CRUD routes
	RouteHelper.registerCrudRoutes(fastify, "/api/v1/spaces", spacesController);

	// Bookings CRUD routes
	RouteHelper.registerCrudRoutes(
		fastify,
		"/api/v1/bookings",
		bookingsController
	);

	// Additional booking-specific routes
	RouteHelper.registerRoute(
		fastify,
		"PATCH",
		"/api/v1/bookings/:id/cancel",
		bookingsController.cancel,
		bookingsController
	);
}
