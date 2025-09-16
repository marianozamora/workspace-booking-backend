import { FastifyRequest, FastifyReply } from "fastify";

// Authentication middleware
const API_KEY = process.env.API_KEY || "default-api-key-change-in-production";

// Routes that don't require API key
const PUBLIC_ROUTES = [
	"/health",
	"/docs",
	"/docs/static",
	"/docs/json",
	"/debug",
];

export async function authenticateApiKey(
	request: FastifyRequest,
	reply: FastifyReply
) {
	// Skip authentication for public routes
	const isPublicRoute = PUBLIC_ROUTES.some(route =>
		request.url.startsWith(route)
	);

	// Special case: exact match for /api info endpoint
	const isApiInfoRoute = request.url === "/api";

	if (isPublicRoute || isApiInfoRoute) {
		return;
	}

	const apiKey = request.headers["x-api-key"] as string;

	if (!apiKey || apiKey !== API_KEY) {
		return reply.code(401).send({
			error: "Unauthorized",
			message: "Invalid or missing API Key",
		});
	}
}
