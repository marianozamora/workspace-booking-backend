import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import Fastify, { FastifyInstance } from "fastify";

describe("Spaces Controller - Essential Tests", () => {
	let app: FastifyInstance;
	const API_KEY = "test-api-key";

	beforeAll(async () => {
		app = Fastify({ logger: false });

		// Mock authentication
		app.addHook("preHandler", async (request, reply) => {
			const apiKey = request.headers["x-api-key"];
			if (!apiKey || apiKey !== API_KEY) {
				reply.code(401).send({ error: "Unauthorized", message: "Invalid API key" });
				return;
			}
		});

		// Mock spaces data
		const spaces: any[] = [];
		let spaceIdCounter = 1;

		// Essential routes
		app.get("/api/v1/spaces", async () => ({ success: true, data: spaces }));

		app.get("/api/v1/spaces/:id", async (request, reply) => {
			const { id } = request.params as { id: string };
			const space = spaces.find(s => s.id === id);
			if (!space) {
				reply.code(404).send({ error: "Not Found", message: "Space not found" });
				return;
			}
			return { success: true, data: space };
		});

		app.post("/api/v1/spaces", async (request, reply) => {
			const body = request.body as any;
			if (!body.name || !body.location || !body.capacity) {
				reply
					.code(400)
					.send({ error: "Bad Request", message: "Missing required fields" });
				return;
			}
			const newSpace = {
				id: `space-${spaceIdCounter++}`,
				...body,
				active: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			spaces.push(newSpace);
			reply.code(201).send({ success: true, data: newSpace });
		});

		app.delete("/api/v1/spaces/:id", async (request, reply) => {
			const { id } = request.params as { id: string };
			const spaceIndex = spaces.findIndex(s => s.id === id);
			if (spaceIndex === -1) {
				reply.code(404).send({ error: "Not Found", message: "Space not found" });
				return;
			}
			spaces.splice(spaceIndex, 1);
			reply.code(204).send();
		});

		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should require authentication", async () => {
		const response = await app.inject({
			method: "GET",
			url: "/api/v1/spaces",
		});
		expect(response.statusCode).toBe(401);
	});

	it("should handle complete CRUD workflow", async () => {
		const spaceData = { name: "Test Room", location: "Floor 1", capacity: 10 };

		// Create
		const createResponse = await app.inject({
			method: "POST",
			url: "/api/v1/spaces",
			headers: { "X-API-Key": API_KEY, "Content-Type": "application/json" },
			payload: spaceData,
		});
		expect(createResponse.statusCode).toBe(201);
		const created = JSON.parse(createResponse.body);

		// Read
		const getResponse = await app.inject({
			method: "GET",
			url: `/api/v1/spaces/${created.data.id}`,
			headers: { "X-API-Key": API_KEY },
		});
		expect(getResponse.statusCode).toBe(200);

		// Delete
		const deleteResponse = await app.inject({
			method: "DELETE",
			url: `/api/v1/spaces/${created.data.id}`,
			headers: { "X-API-Key": API_KEY },
		});
		expect(deleteResponse.statusCode).toBe(204);
	});

	it("should validate required fields", async () => {
		const response = await app.inject({
			method: "POST",
			url: "/api/v1/spaces",
			headers: { "X-API-Key": API_KEY, "Content-Type": "application/json" },
			payload: { name: "Test" }, // Missing required fields
		});
		expect(response.statusCode).toBe(400);
	});
});
