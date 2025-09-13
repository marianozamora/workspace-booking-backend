import { Space } from "@/domain/entities";
import { SpacesRepository, Logger } from "@/domain/ports";
import { CreateSpaceDto, UpdateSpaceDto } from "./DTOs";

export class SpaceUseCases {
	constructor(
		private readonly spacesRepository: SpacesRepository,
		private readonly logger: Logger
	) {}

	async getAllSpaces(): Promise<Space[]> {
		this.logger.info("Getting all spaces");
		return this.spacesRepository.findAll();
	}

	async getSpaceById(id: string): Promise<Space> {
		this.logger.info("Getting space by ID", { id });

		const space = await this.spacesRepository.findById(id);
		if (!space) {
			throw new Error("Space not found");
		}

		return space;
	}

	async createSpace(dto: CreateSpaceDto): Promise<Space> {
		this.logger.info("Creating new space", { name: dto.name });

		const space = Space.create(
			crypto.randomUUID(),
			dto.name,
			dto.location,
			dto.capacity,
			dto.description
		);

		const createdSpace = await this.spacesRepository.create(space);

		this.logger.info("Space created successfully", {
			id: createdSpace.id,
			name: createdSpace.getName(),
		});

		return createdSpace;
	}

	async updateSpace(dto: UpdateSpaceDto): Promise<Space> {
		this.logger.info("Updating space", { id: dto.id });

		const existingSpace = await this.getSpaceById(dto.id);

		// Create new instance with updated data
		const updatedSpace = Space.create(
			existingSpace.id,
			dto.name ?? existingSpace.getName(),
			dto.location ?? existingSpace.getLocation(),
			dto.capacity ?? existingSpace.getCapacity(),
			dto.description ?? existingSpace.getDescription() ?? undefined,
			dto.active ?? existingSpace.isActive(),
			existingSpace.createdAt,
			new Date()
		);

		const savedSpace = await this.spacesRepository.update(updatedSpace);

		this.logger.info("Space updated successfully", { id: dto.id });

		return savedSpace;
	}

	async deleteSpace(id: string): Promise<void> {
		this.logger.info("Deleting space", { id });

		const exists = await this.spacesRepository.existsById(id);
		if (!exists) {
			throw new Error("Space not found");
		}

		await this.spacesRepository.delete(id);

		this.logger.info("Space deleted successfully", { id });
	}
}
