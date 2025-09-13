import { z } from "zod";
import { FastifyReply } from "fastify";
import { ApiResponse } from "./ApiResponse";

export class ValidationHelper {
	static validateAndRespond<T>(
		schema: z.ZodSchema<T>,
		data: unknown,
		reply: FastifyReply
	): { success: false } | { success: true; data: T } {
		const validation = schema.safeParse(data);

		if (!validation.success) {
			ApiResponse.validationError(reply, validation.error.errors);
			return { success: false };
		}

		return { success: true, data: validation.data };
	}
}
