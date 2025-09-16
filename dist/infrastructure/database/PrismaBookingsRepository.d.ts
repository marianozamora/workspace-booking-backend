import { PrismaClient } from "@prisma/client";
import { Booking } from "../../domain/entities";
import { BookingsRepository, PaginationResult, BookingFilters } from "../../domain/ports";
import { BaseRepository } from "./BaseRepository";
export declare class PrismaBookingsRepository extends BaseRepository<Booking, any> implements BookingsRepository {
    constructor(prisma: PrismaClient);
    findAll(page: number, limit: number, filters?: BookingFilters): Promise<PaginationResult<Booking>>;
    findBySpaceAndDate(spaceId: string, date: Date): Promise<Booking[]>;
    findActiveByClientInWeek(clientEmail: string, startDate: Date, endDate: Date): Promise<Booking[]>;
    private buildWhereClause;
}
