import { PrismaClient } from "@prisma/client";
import { Booking } from "@/domain/entities";
import {
	BookingsRepository,
	PaginationResult,
	BookingFilters,
} from "@/domain/ports";
import { BookingMapper } from "./mappers";
import { BaseRepository } from "./BaseRepository";

// Implementation of Bookings repository using Prisma
export class PrismaBookingsRepository
	extends BaseRepository<Booking, any>
	implements BookingsRepository
{
	constructor(prisma: PrismaClient) {
		super(prisma, "booking", new BookingMapper());
	}

	async findAll(
		page: number,
		limit: number,
		filters?: BookingFilters
	): Promise<PaginationResult<Booking>> {
		const skip = (page - 1) * limit;
		const where = this.buildWhereClause(filters);

		const [bookings, total] = await Promise.all([
			this.prisma.booking.findMany({
				where,
				skip,
				take: limit,
				orderBy: [{ createdAt: "desc" }, { date: "desc" }, { startTime: "asc" }],
				include: {
					space: true,
				},
			}),
			this.prisma.booking.count({ where }),
		]);

		return {
			items: bookings.map(BookingMapper.toDomain),
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}

	async findBySpaceAndDate(spaceId: string, date: Date): Promise<Booking[]> {
		const bookings = await this.prisma.booking.findMany({
			where: {
				spaceId: spaceId,
				date: {
					equals: date,
				},
			},
			orderBy: { startTime: "asc" },
		});

		return bookings.map(BookingMapper.toDomain);
	}

	async findActiveByClientInWeek(
		clientEmail: string,
		startDate: Date,
		endDate: Date
	): Promise<Booking[]> {
		const bookings = await this.prisma.booking.findMany({
			where: {
				clientEmail: clientEmail,
				status: "ACTIVE",
				date: {
					gte: startDate,
					lte: endDate,
				},
			},
		});

		return bookings.map(BookingMapper.toDomain);
	}

	private buildWhereClause(filters?: BookingFilters) {
		if (!filters) {
			return {};
		}

		const where: any = {};

		if (filters.spaceId) {
			where.spaceId = filters.spaceId;
		}

		if (filters.clientEmail) {
			where.clientEmail = {
				contains: filters.clientEmail,
				mode: "insensitive",
			};
		}

		if (filters.date) {
			where.date = {
				equals: filters.date,
			};
		}

		if (filters.status) {
			where.status = filters.status;
		}

		return where;
	}
}
