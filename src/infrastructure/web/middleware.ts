import { FastifyRequest, FastifyReply } from "fastify";

// Authentication middleware
const API_KEY = process.env.API_KEY || "default-api-key-change-in-production";

export async function authenticateApiKey(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const apiKey = request.headers["x-api-key"] as string;

	if (!apiKey || apiKey !== API_KEY) {
		return reply.code(401).send({
			error: "Unauthorized",
			message: "Invalid or missing API Key",
		});
	}
}
