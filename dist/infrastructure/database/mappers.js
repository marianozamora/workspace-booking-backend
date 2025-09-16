"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingMapper = exports.SpaceMapper = void 0;
const entities_1 = require("../../domain/entities");
class SpaceMapper {
    static toDomain(prismaSpace) {
        return entities_1.Space.create(prismaSpace.id, prismaSpace.name, prismaSpace.location, prismaSpace.capacity, prismaSpace.description ?? undefined, prismaSpace.active, prismaSpace.createdAt, prismaSpace.updatedAt);
    }
    static toPrisma(space) {
        return {
            id: space.id,
            name: space.getName(),
            location: space.getLocation(),
            capacity: space.getCapacity(),
            description: space.getDescription(),
            active: space.isActive(),
        };
    }
    toDomain(prismaSpace) {
        return SpaceMapper.toDomain(prismaSpace);
    }
    toPrisma(space) {
        return SpaceMapper.toPrisma(space);
    }
}
exports.SpaceMapper = SpaceMapper;
class BookingMapper {
    static toDomain(prismaBooking) {
        return entities_1.Booking.create(prismaBooking.id, prismaBooking.spaceId, prismaBooking.clientEmail, prismaBooking.date, prismaBooking.startTime, prismaBooking.endTime, prismaBooking.status, prismaBooking.createdAt, prismaBooking.updatedAt);
    }
    static toPrisma(booking) {
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
    toDomain(prismaBooking) {
        return BookingMapper.toDomain(prismaBooking);
    }
    toPrisma(booking) {
        return BookingMapper.toPrisma(booking);
    }
}
exports.BookingMapper = BookingMapper;
