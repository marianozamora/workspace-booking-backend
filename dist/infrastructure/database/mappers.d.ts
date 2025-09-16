import { PrismaClient } from "@prisma/client";
import { Space, Booking } from "../../domain/entities";
import { Mapper } from "./BaseRepository";
type PrismaSpace = NonNullable<Awaited<ReturnType<PrismaClient["space"]["findUnique"]>>>;
type PrismaBooking = NonNullable<Awaited<ReturnType<PrismaClient["booking"]["findUnique"]>>>;
export declare class SpaceMapper implements Mapper<Space, PrismaSpace> {
    static toDomain(prismaSpace: PrismaSpace): Space;
    static toPrisma(space: Space): Omit<PrismaSpace, "createdAt" | "updatedAt">;
    toDomain(prismaSpace: PrismaSpace): Space;
    toPrisma(space: Space): Omit<PrismaSpace, "createdAt" | "updatedAt">;
}
export declare class BookingMapper implements Mapper<Booking, PrismaBooking> {
    static toDomain(prismaBooking: PrismaBooking): Booking;
    static toPrisma(booking: Booking): Omit<PrismaBooking, "createdAt" | "updatedAt">;
    toDomain(prismaBooking: PrismaBooking): Booking;
    toPrisma(booking: Booking): Omit<PrismaBooking, "createdAt" | "updatedAt">;
}
export {};
