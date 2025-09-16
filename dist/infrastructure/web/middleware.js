"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateApiKey = authenticateApiKey;
const API_KEY = process.env.API_KEY || "default-api-key-change-in-production";
const PUBLIC_ROUTES = [
    "/health",
    "/docs",
    "/docs/static",
    "/docs/json",
    "/debug",
];
async function authenticateApiKey(request, reply) {
    const isPublicRoute = PUBLIC_ROUTES.some(route => request.url.startsWith(route));
    const isApiInfoRoute = request.url === "/api";
    if (isPublicRoute || isApiInfoRoute) {
        return;
    }
    const apiKey = request.headers["x-api-key"];
    if (!apiKey || apiKey !== API_KEY) {
        return reply.code(401).send({
            error: "Unauthorized",
            message: "Invalid or missing API Key",
        });
    }
}
