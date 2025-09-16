import { PrismaClient } from "@prisma/client";
export interface Mapper<DomainEntity, PrismaModel> {
    toDomain(prismaModel: PrismaModel): DomainEntity;
    toPrisma(entity: DomainEntity): Omit<PrismaModel, "createdAt" | "updatedAt">;
}
export declare abstract class BaseRepository<DomainEntity, PrismaModel> {
    protected readonly prisma: PrismaClient;
    protected readonly modelName: string;
    protected readonly mapper: Mapper<DomainEntity, PrismaModel>;
    constructor(prisma: PrismaClient, modelName: string, mapper: Mapper<DomainEntity, PrismaModel>);
    findById(id: string): Promise<DomainEntity | null>;
    create(entity: DomainEntity): Promise<DomainEntity>;
    update(entity: DomainEntity): Promise<DomainEntity>;
    delete(id: string): Promise<void>;
    existsById(id: string): Promise<boolean>;
}
