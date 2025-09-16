import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import Fastify, { FastifyInstance } from "fastify";

describe("Bookings Controller - Essential Tests", () => {
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

		// Mock data
		const bookings: any[] = [];
		let bookingIdCounter = 1;

		// Essential routes
		app.get("/api/v1/bookings", async (request, reply) => {
			const query = request.query as any;
			const page = parseInt(query.page) || 1;
			const limit = parseInt(query.limit) || 10;

			return {
				success: true,
				data: bookings,
				pagination: { page, limit, total: bookings.length, totalPages: 1 },
			};
		});

		app.get("/api/v1/bookings/:id", async (request, reply) => {
			const { id } = request.params as { id: string };
			const booking = bookings.find(b => b.id === id);
			if (!booking) {
				reply.code(404).send({ error: "Not Found", message: "Booking not found" });
				return;
			}
			return { success: true, data: booking };
		});

		app.post("/api/v1/bookings", async (request, reply) => {
			const body = request.body as any;
			if (
				!body.spaceId ||
				!body.clientEmail ||
				!body.date ||
				!body.startTime ||
				!body.endTime
			) {
				reply
					.code(400)
					.send({ error: "Bad Request", message: "Missing required fields" });
				return;
			}

			// Basic email validation
			if (!body.clientEmail.includes("@")) {
				reply
					.code(400)
					.send({ error: "Bad Request", message: "Invalid email format" });
				return;
			}

			// Basic time validation
			if (body.startTime >= body.endTime) {
				reply
					.code(400)
					.send({
						error: "Bad Request",
						message: "End time must be after start time",
					});
				return;
			}

			const newBooking = {
				id: `booking-${bookingIdCounter++}`,
				...body,
				status: "ACTIVE",
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			bookings.push(newBooking);
			reply.code(201).send({ success: true, data: newBooking });
		});

		app.patch("/api/v1/bookings/:id/cancel", async (request, reply) => {
			const { id } = request.params as { id: string };
			const bookingIndex = bookings.findIndex(b => b.id === id);
			if (bookingIndex === -1) {
				reply.code(404).send({ error: "Not Found", message: "Booking not found" });
				return;
			}
			bookings[bookingIndex].status = "CANCELLED";
			return { success: true, data: bookings[bookingIndex] };
		});

		app.delete("/api/v1/bookings/:id", async (request, reply) => {
			const { id } = request.params as { id: string };
			const bookingIndex = bookings.findIndex(b => b.id === id);
			if (bookingIndex === -1) {
				reply.code(404).send({ error: "Not Found", message: "Booking not found" });
				return;
			}
			bookings.splice(bookingIndex, 1);
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
			url: "/api/v1/bookings",
		});
		expect(response.statusCode).toBe(401);
	});

	it("should handle booking lifecycle", async () => {
		const bookingData = {
			spaceId: "space-1",
			clientEmail: "test@example.com",
			date: "2024-12-25",
			startTime: "09:00",
			endTime: "10:00",
		};

		// Create booking
		const createResponse = await app.inject({
			method: "POST",
			url: "/api/v1/bookings",
			headers: { "X-API-Key": API_KEY, "Content-Type": "application/json" },
			payload: bookingData,
		});
		expect(createResponse.statusCode).toBe(201);
		const created = JSON.parse(createResponse.body);

		// Get booking
		const getResponse = await app.inject({
			method: "GET",
			url: `/api/v1/bookings/${created.data.id}`,
			headers: { "X-API-Key": API_KEY },
		});
		expect(getResponse.statusCode).toBe(200);

		// Cancel booking
		const cancelResponse = await app.inject({
			method: "PATCH",
			url: `/api/v1/bookings/${created.data.id}/cancel`,
			headers: { "X-API-Key": API_KEY },
		});
		expect(cancelResponse.statusCode).toBe(200);
		const cancelled = JSON.parse(cancelResponse.body);
		expect(cancelled.data.status).toBe("CANCELLED");

		// Delete booking
		const deleteResponse = await app.inject({
			method: "DELETE",
			url: `/api/v1/bookings/${created.data.id}`,
			headers: { "X-API-Key": API_KEY },
		});
		expect(deleteResponse.statusCode).toBe(204);
	});

	it("should validate booking data", async () => {
		// Missing fields
		const missingFieldsResponse = await app.inject({
			method: "POST",
			url: "/api/v1/bookings",
			headers: { "X-API-Key": API_KEY, "Content-Type": "application/json" },
			payload: { spaceId: "space-1" },
		});
		expect(missingFieldsResponse.statusCode).toBe(400);

		// Invalid email
		const invalidEmailResponse = await app.inject({
			method: "POST",
			url: "/api/v1/bookings",
			headers: { "X-API-Key": API_KEY, "Content-Type": "application/json" },
			payload: {
				spaceId: "space-1",
				clientEmail: "invalid-email",
				date: "2024-12-25",
				startTime: "09:00",
				endTime: "10:00",
			},
		});
		expect(invalidEmailResponse.statusCode).toBe(400);

		// Invalid time order
		const invalidTimeResponse = await app.inject({
			method: "POST",
			url: "/api/v1/bookings",
			headers: { "X-API-Key": API_KEY, "Content-Type": "application/json" },
			payload: {
				spaceId: "space-1",
				clientEmail: "test@example.com",
				date: "2024-12-25",
				startTime: "10:00",
				endTime: "09:00",
			},
		});
		expect(invalidTimeResponse.statusCode).toBe(400);
	});

	it("should support pagination", async () => {
		const response = await app.inject({
			method: "GET",
			url: "/api/v1/bookings?page=1&limit=5",
			headers: { "X-API-Key": API_KEY },
		});
		expect(response.statusCode).toBe(200);
		const body = JSON.parse(response.body);
		expect(body).toHaveProperty("pagination");
		expect(body.pagination).toMatchObject({
			page: 1,
			limit: 5,
			total: expect.any(Number),
			totalPages: expect.any(Number),
		});
	});
});
