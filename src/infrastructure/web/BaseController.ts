import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { ApiResponse, EntitySerializer } from "./ApiResponse";
import { ValidationHelper } from "./ValidationHelper";

export abstract class BaseController {
	// Generic method for handling standard CRUD operations
	protected async handleValidatedRequest<TBody, TEntity>(
		request: FastifyRequest<{ Body: TBody }>,
		reply: FastifyReply,
		schema: z.ZodSchema<TBody>,
		operation: (validatedData: TBody) => Promise<TEntity>,
		serializer: (entity: TEntity) => any,
		successStatusCode: number = 200
	) {
		try {
			const validation = ValidationHelper.validateAndRespond(
				schema,
				request.body,
				reply
			);

			if (!validation.success) {
				return; // Response already sent by ValidationHelper
			}

			const result = await operation(validation.data);
			const serializedResult = serializer(result);
			return ApiResponse.success(reply, serializedResult, successStatusCode);
		} catch (error) {
			return this.handleStandardError(error, reply);
		}
	}

	// Generic method for operations with ID parameter
	protected async handleByIdRequest<TEntity>(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
		operation: (id: string) => Promise<TEntity>,
		serializer: (entity: TEntity) => any
	) {
		try {
			const { id } = request.params;
			const result = await operation(id);
			const serializedResult = serializer(result);
			return ApiResponse.success(reply, serializedResult);
		} catch (error) {
			return this.handleStandardError(error, reply);
		}
	}

	// Generic method for update operations
	protected async handleUpdateRequest<TBody, TEntity>(
		request: FastifyRequest<{
			Params: { id: string };
			Body: TBody;
		}>,
		reply: FastifyReply,
		schema: z.ZodSchema<TBody>,
		operation: (id: string, data: TBody) => Promise<TEntity>,
		serializer: (entity: TEntity) => any
	) {
		try {
			const { id } = request.params;
			const validation = ValidationHelper.validateAndRespond(
				schema,
				request.body,
				reply
			);

			if (!validation.success) {
				return; // Response already sent by ValidationHelper
			}

			const result = await operation(id, validation.data);
			const serializedResult = serializer(result);
			return ApiResponse.success(reply, serializedResult);
		} catch (error) {
			return this.handleStandardError(error, reply);
		}
	}

	// Generic method for delete operations
	protected async handleDeleteRequest(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
		operation: (id: string) => Promise<void>
	) {
		try {
			const { id } = request.params;
			await operation(id);
			return reply.code(204).send();
		} catch (error) {
			return this.handleStandardError(error, reply);
		}
	}

	// Centralized error handling
	private handleStandardError(error: unknown, reply: FastifyReply) {
		if (error instanceof Error) {
			// Map common domain errors to appropriate HTTP responses
			if (error.message.includes("not found")) {
				return ApiResponse.notFound(reply, error.message);
			}
			if (error.message.includes("Validation error")) {
				return ApiResponse.badRequest(reply, error.message);
			}
			if (error.message.includes("already exists")) {
				return ApiResponse.error(reply, error.message, 409, "Conflict");
			}
		}

		// Default to 500 for unknown errors
		return ApiResponse.error(
			reply,
			error instanceof Error ? error.message : "Unknown error occurred"
		);
	}
}
