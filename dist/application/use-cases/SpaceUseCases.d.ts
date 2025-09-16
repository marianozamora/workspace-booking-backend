import { Space } from "../../domain/entities";
import { SpacesRepository, Logger } from "../../domain/ports";
import { CreateSpaceDto, UpdateSpaceDto } from "./DTOs";
export declare class SpaceUseCases {
    private readonly spacesRepository;
    private readonly logger;
    constructor(spacesRepository: SpacesRepository, logger: Logger);
    getAllSpaces(): Promise<Space[]>;
    getSpaceById(id: string): Promise<Space>;
    createSpace(dto: CreateSpaceDto): Promise<Space>;
    updateSpace(dto: UpdateSpaceDto): Promise<Space>;
    deleteSpace(id: string): Promise<void>;
}
