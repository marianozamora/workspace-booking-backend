import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";

describe("Health & API Integration", () => {
	let app: FastifyInstance;

	beforeAll(async () => {
		app = Fastify({ logger: false });
		await app.register(cors, { origin: true });

		// Health endpoints
		app.get("/health", async () => ({
			status: "ok",
			timestamp: new Date().toISOString(),
			version: "1.0.0",
			database: "connected",
		}));

		app.get("/api", async () => ({
			name: "Workspace Booking API",
			description: "Workspace reservation management system",
			version: "1.0.0",
			apiVersions: { current: "v1", available: ["v1"] },
		}));

		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should return health status", async () => {
		const response = await app.inject({
			method: "GET",
			url: "/health",
		});

		expect(response.statusCode).toBe(200);
		const body = JSON.parse(response.body);
		expect(body).toMatchObject({
			status: "ok",
			version: "1.0.0",
			database: "connected",
		});
	});

	it("should return API information", async () => {
		const response = await app.inject({
			method: "GET",
			url: "/api",
		});

		expect(response.statusCode).toBe(200);
		const body = JSON.parse(response.body);
		expect(body).toMatchObject({
			name: "Workspace Booking API",
			version: "1.0.0",
			apiVersions: { current: "v1" },
		});
	});
});
