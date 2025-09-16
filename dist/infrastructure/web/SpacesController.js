"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpacesController = void 0;
const schemas_1 = require("./schemas");
const ApiResponse_1 = require("./ApiResponse");
class SpacesController {
    constructor(spaceUseCases) {
        this.spaceUseCases = spaceUseCases;
    }
    async getAll(request, reply) {
        try {
            const filtersValidation = schemas_1.SpaceFiltersSchema.safeParse(request.query);
            if (!filtersValidation.success) {
                return ApiResponse_1.ApiResponse.validationError(reply, filtersValidation.error.errors);
            }
            const filters = filtersValidation.data;
            let spaces = await this.spaceUseCases.getAllSpaces();
            if (filters.availableOnly) {
                spaces = spaces.filter(space => space.isActive());
            }
            if (filters.capacity) {
                spaces = spaces.filter(space => space.getCapacity() >= filters.capacity);
            }
            const serializedSpaces = spaces.map(ApiResponse_1.EntitySerializer.space);
            return ApiResponse_1.ApiResponse.success(reply, serializedSpaces);
        }
        catch (error) {
            return ApiResponse_1.ApiResponse.error(reply, "Error getting spaces");
        }
    }
    async getById(request, reply) {
        try {
            const { id } = request.params;
            const space = await this.spaceUseCases.getSpaceById(id);
            const serializedSpace = ApiResponse_1.EntitySerializer.space(space);
            return ApiResponse_1.ApiResponse.success(reply, serializedSpace);
        }
        catch (error) {
            if (error instanceof Error && error.message === "Space not found") {
                return ApiResponse_1.ApiResponse.notFound(reply, error.message);
            }
            return ApiResponse_1.ApiResponse.error(reply, "Error getting space");
        }
    }
    async create(request, reply) {
        try {
            const validation = schemas_1.CreateSpaceSchema.safeParse(request.body);
            if (!validation.success) {
                return ApiResponse_1.ApiResponse.validationError(reply, validation.error.errors);
            }
            const space = await this.spaceUseCases.createSpace(validation.data);
            const serializedSpace = ApiResponse_1.EntitySerializer.space(space);
            return ApiResponse_1.ApiResponse.created(reply, serializedSpace, "Space created successfully");
        }
        catch (error) {
            return ApiResponse_1.ApiResponse.error(reply, "Error creating space");
        }
    }
    async update(request, reply) {
        try {
            const { id } = request.params;
            const validation = schemas_1.UpdateSpaceSchema.safeParse(request.body);
            if (!validation.success) {
                return ApiResponse_1.ApiResponse.validationError(reply, validation.error.errors);
            }
            const space = await this.spaceUseCases.updateSpace({
                id,
                ...validation.data,
            });
            const serializedSpace = ApiResponse_1.EntitySerializer.space(space);
            return ApiResponse_1.ApiResponse.success(reply, serializedSpace);
        }
        catch (error) {
            if (error instanceof Error && error.message === "Space not found") {
                return ApiResponse_1.ApiResponse.notFound(reply, error.message);
            }
            return ApiResponse_1.ApiResponse.error(reply, "Error updating space");
        }
    }
    async delete(request, reply) {
        try {
            const { id } = request.params;
            await this.spaceUseCases.deleteSpace(id);
            return reply.code(204).send();
        }
        catch (error) {
            if (error instanceof Error && error.message === "Space not found") {
                return ApiResponse_1.ApiResponse.notFound(reply, error.message);
            }
            return ApiResponse_1.ApiResponse.error(reply, "Error deleting space");
        }
    }
}
exports.SpacesController = SpacesController;
