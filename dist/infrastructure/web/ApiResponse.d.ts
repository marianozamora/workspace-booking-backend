import { FastifyReply } from "fastify";
export declare class ApiResponse {
    static success<T>(reply: FastifyReply, data: T, statusCode?: number): FastifyReply<import("fastify").RawServerDefault, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, import("fastify").RouteGenericInterface, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    static created<T>(reply: FastifyReply, data: T, message?: string): FastifyReply<import("fastify").RawServerDefault, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, import("fastify").RouteGenericInterface, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    static error(reply: FastifyReply, message: string, statusCode?: number, errorType?: string): FastifyReply<import("fastify").RawServerDefault, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, import("fastify").RouteGenericInterface, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    static notFound(reply: FastifyReply, message?: string): FastifyReply<import("fastify").RawServerDefault, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, import("fastify").RouteGenericInterface, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    static badRequest(reply: FastifyReply, message?: string): FastifyReply<import("fastify").RawServerDefault, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, import("fastify").RouteGenericInterface, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
    static validationError(reply: FastifyReply, errors: any): FastifyReply<import("fastify").RawServerDefault, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, import("fastify").RouteGenericInterface, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
}
export declare class EntitySerializer {
    static space(space: any): {
        id: any;
        name: any;
        location: any;
        capacity: any;
        description: any;
        active: any;
        createdAt: any;
        updatedAt: any;
    };
    static booking(booking: any): {
        id: any;
        spaceId: any;
        clientEmail: any;
        date: any;
        startTime: any;
        endTime: any;
        status: any;
        createdAt: any;
        updatedAt: any;
    };
}
