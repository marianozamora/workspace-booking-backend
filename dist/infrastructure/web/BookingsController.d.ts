import { FastifyRequest, FastifyReply } from "fastify";
import { BookingUseCases, SpaceUseCases, CreateBookingDto, UpdateBookingDto } from "../../application/use-cases";
export declare class BookingsController {
    private readonly bookingUseCases;
    private readonly spaceUseCases;
    constructor(bookingUseCases: BookingUseCases, spaceUseCases: SpaceUseCases);
    getAll(request: FastifyRequest<{
        Querystring: {
            page?: number;
            limit?: number;
            spaceId?: string;
            clientEmail?: string;
            date?: string;
            status?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getById(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    create(request: FastifyRequest<{
        Body: CreateBookingDto;
    }>, reply: FastifyReply): Promise<never>;
    update(request: FastifyRequest<{
        Params: {
            id: string;
        };
        Body: Omit<UpdateBookingDto, "id">;
    }>, reply: FastifyReply): Promise<never>;
    delete(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    cancel(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
}
