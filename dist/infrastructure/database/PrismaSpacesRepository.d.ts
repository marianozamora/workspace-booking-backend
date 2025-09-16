import { PrismaClient } from "@prisma/client";
import { Space } from "../../domain/entities";
import { SpacesRepository } from "../../domain/ports";
import { BaseRepository } from "./BaseRepository";
export declare class PrismaSpacesRepository extends BaseRepository<Space, any> implements SpacesRepository {
    constructor(prisma: PrismaClient);
    findAll(): Promise<Space[]>;
}
