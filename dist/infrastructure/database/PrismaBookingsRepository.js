"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaBookingsRepository = void 0;
const mappers_1 = require("./mappers");
const BaseRepository_1 = require("./BaseRepository");
class PrismaBookingsRepository extends BaseRepository_1.BaseRepository {
    constructor(prisma) {
        super(prisma, "booking", new mappers_1.BookingMapper());
    }
    async findAll(page, limit, filters) {
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
            items: bookings.map(mappers_1.BookingMapper.toDomain),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findBySpaceAndDate(spaceId, date) {
        const bookings = await this.prisma.booking.findMany({
            where: {
                spaceId: spaceId,
                date: {
                    equals: date,
                },
            },
            orderBy: { startTime: "asc" },
        });
        return bookings.map(mappers_1.BookingMapper.toDomain);
    }
    async findActiveByClientInWeek(clientEmail, startDate, endDate) {
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
        return bookings.map(mappers_1.BookingMapper.toDomain);
    }
    buildWhereClause(filters) {
        if (!filters) {
            return {};
        }
        const where = {};
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
exports.PrismaBookingsRepository = PrismaBookingsRepository;
