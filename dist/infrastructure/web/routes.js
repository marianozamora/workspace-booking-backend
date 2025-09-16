"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = setupRoutes;
const middleware_1 = require("./middleware");
const RouteHelper_1 = require("./RouteHelper");
function setupRoutes(fastify, spacesController, bookingsController) {
    fastify.addHook("preHandler", middleware_1.authenticateApiKey);
    RouteHelper_1.RouteHelper.registerCrudRoutes(fastify, "/api/v1/spaces", spacesController);
    RouteHelper_1.RouteHelper.registerCrudRoutes(fastify, "/api/v1/bookings", bookingsController);
    RouteHelper_1.RouteHelper.registerRoute(fastify, "PATCH", "/api/v1/bookings/:id/cancel", bookingsController.cancel, bookingsController);
}
