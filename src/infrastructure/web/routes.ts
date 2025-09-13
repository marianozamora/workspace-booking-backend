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

	// Spaces CRUD routes
	RouteHelper.registerCrudRoutes(fastify, "/api/spaces", spacesController);

	// Bookings CRUD routes
	RouteHelper.registerCrudRoutes(fastify, "/api/bookings", bookingsController);

	// Additional booking-specific routes
	RouteHelper.registerRoute(
		fastify,
		"PATCH",
		"/api/bookings/:id/cancel",
		bookingsController.cancel,
		bookingsController
	);
}
