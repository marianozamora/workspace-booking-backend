import { PrismaClient } from "@prisma/client";
import { Space, Booking, BookingStatus } from "@/domain/entities";
import { Mapper } from "./BaseRepository";

type PrismaSpace = NonNullable<
	Awaited<ReturnType<PrismaClient["space"]["findUnique"]>>
>;
type PrismaBooking = NonNullable<
	Awaited<ReturnType<PrismaClient["booking"]["findUnique"]>>
>;

// Mappers to convert between domain entities and Prisma models
export class SpaceMapper implements Mapper<Space, PrismaSpace> {
	static toDomain(prismaSpace: PrismaSpace): Space {
		return Space.create(
			prismaSpace.id,
			prismaSpace.name,
			prismaSpace.location,
			prismaSpace.capacity,
			prismaSpace.description,
			prismaSpace.active,
			prismaSpace.createdAt,
			prismaSpace.updatedAt
		);
	}

	static toPrisma(space: Space): Omit<PrismaSpace, "createdAt" | "updatedAt"> {
		return {
			id: space.id,
			name: space.getName(),
			location: space.getLocation(),
			capacity: space.getCapacity(),
			description: space.getDescription(),
			active: space.isActive(),
		};
	}

	// Instance methods for BaseRepository compatibility
	toDomain(prismaSpace: PrismaSpace): Space {
		return SpaceMapper.toDomain(prismaSpace);
	}

	toPrisma(space: Space): Omit<PrismaSpace, "createdAt" | "updatedAt"> {
		return SpaceMapper.toPrisma(space);
	}
}

export class BookingMapper implements Mapper<Booking, PrismaBooking> {
	static toDomain(prismaBooking: PrismaBooking): Booking {
		return Booking.create(
			prismaBooking.id,
			prismaBooking.spaceId,
			prismaBooking.clientEmail,
			prismaBooking.date,
			prismaBooking.startTime,
			prismaBooking.endTime,
			prismaBooking.status as BookingStatus,
			prismaBooking.createdAt,
			prismaBooking.updatedAt
		);
	}

	static toPrisma(
		booking: Booking
	): Omit<PrismaBooking, "createdAt" | "updatedAt"> {
		return {
			id: booking.id,
			spaceId: booking.getSpaceId(),
			clientEmail: booking.getClientEmail(),
			date: booking.getDate(),
			startTime: booking.getStartTime(),
			endTime: booking.getEndTime(),
			status: booking.getStatus(),
		};
	}

	// Instance methods for BaseRepository compatibility
	toDomain(prismaBooking: PrismaBooking): Booking {
		return BookingMapper.toDomain(prismaBooking);
	}

	toPrisma(booking: Booking): Omit<PrismaBooking, "createdAt" | "updatedAt"> {
		return BookingMapper.toPrisma(booking);
	}
}
