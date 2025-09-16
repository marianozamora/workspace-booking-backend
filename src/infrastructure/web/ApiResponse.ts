import { FastifyReply } from "fastify";

export class ApiResponse {
	static success<T>(reply: FastifyReply, data: T, statusCode: number = 200) {
		return reply.code(statusCode).send({
			success: true,
			data,
		});
	}

	static created<T>(reply: FastifyReply, data: T, message?: string) {
		const response: any = {
			success: true,
			data,
		};
		if (message) {
			response.message = message;
		}
		return reply.code(201).send(response);
	}

	static error(
		reply: FastifyReply,
		message: string,
		statusCode: number = 500,
		errorType: string = "Internal Server Error"
	) {
		return reply.code(statusCode).send({
			error: errorType,
			message,
		});
	}

	static notFound(reply: FastifyReply, message: string = "Resource not found") {
		return this.error(reply, message, 404, "Not Found");
	}

	static badRequest(reply: FastifyReply, message: string = "Bad Request") {
		return this.error(reply, message, 400, "Bad Request");
	}

	static validationError(reply: FastifyReply, errors: any) {
		return reply.code(400).send({
			error: "Validation Error",
			message: "Invalid input data",
			details: errors,
		});
	}
}

// Domain entity serialization utilities
export class EntitySerializer {
	static space(space: any) {
		return {
			id: space.id,
			name: space.getName(),
			location: space.getLocation(),
			capacity: space.getCapacity(),
			description: space.getDescription(),
			active: space.isActive(),
			createdAt: space.createdAt,
			updatedAt: space.updatedAt,
		};
	}

	static booking(booking: any) {
		return {
			id: booking.id,
			spaceId: booking.getSpaceId(),
			clientEmail: booking.getClientEmail(),
			date: booking.getDate(),
			startTime: booking.getStartTime(),
			endTime: booking.getEndTime(),
			status: booking.getStatus(),
			createdAt: booking.createdAt,
			updatedAt: booking.updatedAt,
		};
	}
}
