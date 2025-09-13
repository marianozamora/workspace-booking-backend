import { PrismaClient } from "@prisma/client";
import { Space } from "@/domain/entities";
import { SpacesRepository } from "@/domain/ports";
import { SpaceMapper } from "./mappers";
import { BaseRepository } from "./BaseRepository";

// Implementation of Spaces repository using Prisma
export class PrismaSpacesRepository
	extends BaseRepository<Space, any>
	implements SpacesRepository
{
	constructor(prisma: PrismaClient) {
		super(prisma, "space", new SpaceMapper());
	}

	async findAll(): Promise<Space[]> {
		const spaces = await this.prisma.space.findMany({
			orderBy: { name: "asc" },
		});

		return spaces.map(SpaceMapper.toDomain);
	}
}
