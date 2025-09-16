import { FastifyInstance } from "fastify";
export declare class RouteHelper {
    static registerCrudRoutes(fastify: FastifyInstance, basePath: string, controller: any): void;
    static registerRoute(fastify: FastifyInstance, method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH", path: string, handler: Function, controller: any): void;
}
