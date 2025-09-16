import { FastifyRequest, FastifyReply } from "fastify";
import {
	SpaceUseCases,
	CreateSpaceDto,
	UpdateSpaceDto,
} from "@/application/use-cases";
import {
	CreateSpaceSchema,
	UpdateSpaceSchema,
	SpaceFiltersSchema,
} from "./schemas";
import { ApiResponse, EntitySerializer } from "./ApiResponse";

export class SpacesController {
	constructor(private readonly spaceUseCases: SpaceUseCases) {}

	async getAll(
		request: FastifyRequest<{
			Querystring: {
				availableOnly?: string;
				capacity?: string;
			};
		}>,
		reply: FastifyReply
	) {
		try {
			const filtersValidation = SpaceFiltersSchema.safeParse(request.query);

			if (!filtersValidation.success) {
				return ApiResponse.validationError(reply, filtersValidation.error.errors);
			}

			const filters = filtersValidation.data;
			let spaces = await this.spaceUseCases.getAllSpaces();

			// Apply filters
			if (filters.availableOnly) {
				spaces = spaces.filter(space => space.isActive());
			}

			if (filters.capacity) {
				spaces = spaces.filter(space => space.getCapacity() >= filters.capacity!);
			}

			const serializedSpaces = spaces.map(EntitySerializer.space);
			return ApiResponse.success(reply, serializedSpaces);
		} catch (error) {
			return ApiResponse.error(reply, "Error getting spaces");
		}
	}

	async getById(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply
	) {
		try {
			const { id } = request.params;
			const space = await this.spaceUseCases.getSpaceById(id);
			const serializedSpace = EntitySerializer.space(space);
			return ApiResponse.success(reply, serializedSpace);
		} catch (error) {
			if (error instanceof Error && error.message === "Space not found") {
				return ApiResponse.notFound(reply, error.message);
			}
			return ApiResponse.error(reply, "Error getting space");
		}
	}

	async create(
		request: FastifyRequest<{ Body: CreateSpaceDto }>,
		reply: FastifyReply
	) {
		try {
			const validation = CreateSpaceSchema.safeParse(request.body);

			if (!validation.success) {
				return ApiResponse.validationError(reply, validation.error.errors);
			}

			const space = await this.spaceUseCases.createSpace(validation.data);
			const serializedSpace = EntitySerializer.space(space);
			return ApiResponse.created(
				reply,
				serializedSpace,
				"Space created successfully"
			);
		} catch (error) {
			return ApiResponse.error(reply, "Error creating space");
		}
	}

	async update(
		request: FastifyRequest<{
			Params: { id: string };
			Body: Omit<UpdateSpaceDto, "id">;
		}>,
		reply: FastifyReply
	) {
		try {
			const { id } = request.params;
			const validation = UpdateSpaceSchema.safeParse(request.body);

			if (!validation.success) {
				return ApiResponse.validationError(reply, validation.error.errors);
			}

			const space = await this.spaceUseCases.updateSpace({
				id,
				...validation.data,
			});

			const serializedSpace = EntitySerializer.space(space);
			return ApiResponse.success(reply, serializedSpace);
		} catch (error) {
			if (error instanceof Error && error.message === "Space not found") {
				return ApiResponse.notFound(reply, error.message);
			}
			return ApiResponse.error(reply, "Error updating space");
		}
	}

	async delete(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply
	) {
		try {
			const { id } = request.params;
			await this.spaceUseCases.deleteSpace(id);
			return reply.code(204).send();
		} catch (error) {
			if (error instanceof Error && error.message === "Space not found") {
				return ApiResponse.notFound(reply, error.message);
			}
			return ApiResponse.error(reply, "Error deleting space");
		}
	}
}
