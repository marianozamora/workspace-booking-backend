import { FastifyRequest, FastifyReply } from "fastify";

// Authentication middleware
const API_KEY = process.env.API_KEY || "default-api-key-change-in-production";

// Routes that don't require API key
const PUBLIC_ROUTES = [
	"/health",
	"/docs",
	"/docs/static",
	"/docs/json",
	"/api",
];

export async function authenticateApiKey(
	request: FastifyRequest,
	reply: FastifyReply
) {
	// Skip authentication for public routes
	const isPublicRoute = PUBLIC_ROUTES.some((route) =>
		request.url.startsWith(route)
	);

	if (isPublicRoute) {
		return;
	}

	const apiKey = request.headers["x-api-key"] as string;

	// Debug logging (uncomment for troubleshooting)
	// console.log(`🔑 Auth check for ${request.method} ${request.url}`);
	// console.log(`🔑 Expected API key: ${API_KEY}`);
	// console.log(`🔑 Received API key: ${apiKey || "undefined"}`);

	if (!apiKey || apiKey !== API_KEY) {
		return reply.code(401).send({
			error: "Unauthorized",
			message: "Invalid or missing API Key",
		});
	}
}
