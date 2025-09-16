import { FastifyRequest, FastifyReply } from "fastify";
import { SpaceUseCases, CreateSpaceDto, UpdateSpaceDto } from "../../application/use-cases";
export declare class SpacesController {
    private readonly spaceUseCases;
    constructor(spaceUseCases: SpaceUseCases);
    getAll(request: FastifyRequest<{
        Querystring: {
            availableOnly?: string;
            capacity?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getById(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    create(request: FastifyRequest<{
        Body: CreateSpaceDto;
    }>, reply: FastifyReply): Promise<never>;
    update(request: FastifyRequest<{
        Params: {
            id: string;
        };
        Body: Omit<UpdateSpaceDto, "id">;
    }>, reply: FastifyReply): Promise<never>;
    delete(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
}
