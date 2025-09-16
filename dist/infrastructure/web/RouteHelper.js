"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteHelper = void 0;
class RouteHelper {
    static registerCrudRoutes(fastify, basePath, controller) {
        const routes = [
            { method: "GET", path: basePath, handler: controller.getAll },
            { method: "GET", path: `${basePath}/:id`, handler: controller.getById },
            { method: "POST", path: basePath, handler: controller.create },
            { method: "PUT", path: `${basePath}/:id`, handler: controller.update },
            { method: "DELETE", path: `${basePath}/:id`, handler: controller.delete },
        ];
        routes.forEach(({ method, path, handler }) => {
            fastify.route({
                method,
                url: path,
                handler: handler.bind(controller),
            });
        });
    }
    static registerRoute(fastify, method, path, handler, controller) {
        fastify.route({
            method,
            url: path,
            handler: handler.bind(controller),
        });
    }
}
exports.RouteHelper = RouteHelper;
