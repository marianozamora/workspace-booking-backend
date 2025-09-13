import { FastifyInstance } from "fastify";

interface RouteConfig {
	method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
	path: string;
	handler: Function;
}

export class RouteHelper {
	static registerCrudRoutes(
		fastify: FastifyInstance,
		basePath: string,
		controller: any
	) {
		const routes: RouteConfig[] = [
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

	static registerRoute(
		fastify: FastifyInstance,
		method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
		path: string,
		handler: Function,
		controller: any
	) {
		fastify.route({
			method,
			url: path,
			handler: handler.bind(controller),
		});
	}
}
