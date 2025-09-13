import { PrismaClient } from "@prisma/client";

export interface Mapper<DomainEntity, PrismaModel> {
	toDomain(prismaModel: PrismaModel): DomainEntity;
	toPrisma(entity: DomainEntity): Omit<PrismaModel, "createdAt" | "updatedAt">;
}

export abstract class BaseRepository<DomainEntity, PrismaModel> {
	constructor(
		protected readonly prisma: PrismaClient,
		protected readonly modelName: string,
		protected readonly mapper: Mapper<DomainEntity, PrismaModel>
	) {}

	async findById(id: string): Promise<DomainEntity | null> {
		const model = this.prisma[this.modelName as keyof PrismaClient];
		const result = await (model as any).findUnique({
			where: { id },
		});

		return result ? this.mapper.toDomain(result) : null;
	}

	async create(entity: DomainEntity): Promise<DomainEntity> {
		const data = this.mapper.toPrisma(entity);
		const model = this.prisma[this.modelName as keyof PrismaClient];

		const created = await (model as any).create({
			data,
		});

		return this.mapper.toDomain(created);
	}

	async update(entity: DomainEntity): Promise<DomainEntity> {
		const data = this.mapper.toPrisma(entity);
		const model = this.prisma[this.modelName as keyof PrismaClient];

		const updated = await (model as any).update({
			where: { id: (entity as any).id },
			data,
		});

		return this.mapper.toDomain(updated);
	}

	async delete(id: string): Promise<void> {
		const model = this.prisma[this.modelName as keyof PrismaClient];
		await (model as any).delete({
			where: { id },
		});
	}

	async existsById(id: string): Promise<boolean> {
		const model = this.prisma[this.modelName as keyof PrismaClient];
		const count = await (model as any).count({
			where: { id },
		});

		return count > 0;
	}
}
