"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpaceUseCases = void 0;
const entities_1 = require("../../domain/entities");
class SpaceUseCases {
    constructor(spacesRepository, logger) {
        this.spacesRepository = spacesRepository;
        this.logger = logger;
    }
    async getAllSpaces() {
        this.logger.info("Getting all spaces");
        return this.spacesRepository.findAll();
    }
    async getSpaceById(id) {
        this.logger.info("Getting space by ID", { id });
        const space = await this.spacesRepository.findById(id);
        if (!space) {
            throw new Error("Space not found");
        }
        return space;
    }
    async createSpace(dto) {
        this.logger.info("Creating new space", { name: dto.name });
        const space = entities_1.Space.create(crypto.randomUUID(), dto.name, dto.location, dto.capacity, dto.description);
        const createdSpace = await this.spacesRepository.create(space);
        this.logger.info("Space created successfully", {
            id: createdSpace.id,
            name: createdSpace.getName(),
        });
        return createdSpace;
    }
    async updateSpace(dto) {
        this.logger.info("Updating space", { id: dto.id });
        const existingSpace = await this.getSpaceById(dto.id);
        const updatedSpace = entities_1.Space.create(existingSpace.id, dto.name ?? existingSpace.getName(), dto.location ?? existingSpace.getLocation(), dto.capacity ?? existingSpace.getCapacity(), dto.description ?? existingSpace.getDescription() ?? undefined, dto.active ?? existingSpace.isActive(), existingSpace.createdAt, new Date());
        const savedSpace = await this.spacesRepository.update(updatedSpace);
        this.logger.info("Space updated successfully", { id: dto.id });
        return savedSpace;
    }
    async deleteSpace(id) {
        this.logger.info("Deleting space", { id });
        const exists = await this.spacesRepository.existsById(id);
        if (!exists) {
            throw new Error("Space not found");
        }
        await this.spacesRepository.delete(id);
        this.logger.info("Space deleted successfully", { id });
    }
}
exports.SpaceUseCases = SpaceUseCases;
