"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsController = void 0;
const entities_1 = require("../../domain/entities");
const schemas_1 = require("./schemas");
const ApiResponse_1 = require("./ApiResponse");
class BookingsController {
    constructor(bookingUseCases, spaceUseCases) {
        this.bookingUseCases = bookingUseCases;
        this.spaceUseCases = spaceUseCases;
    }
    async getAll(request, reply) {
        try {
            const paginationValidation = schemas_1.PaginationSchema.safeParse(request.query);
            const filtersValidation = schemas_1.BookingFiltersSchema.safeParse(request.query);
            if (!paginationValidation.success || !filtersValidation.success) {
                return ApiResponse_1.ApiResponse.badRequest(reply, "Invalid query parameters");
            }
            const { page, limit } = paginationValidation.data;
            const filters = filtersValidation.data;
            const processedFilters = {};
            if (filters.spaceId) {
                processedFilters.spaceId = filters.spaceId;
            }
            if (filters.clientEmail) {
                processedFilters.clientEmail = filters.clientEmail;
            }
            if (filters.date) {
                processedFilters.date = new Date(filters.date);
            }
            if (filters.status) {
                const statusMap = {
                    ACTIVE: entities_1.BookingStatus.ACTIVE,
                    CONFIRMED: entities_1.BookingStatus.ACTIVE,
                    CANCELLED: entities_1.BookingStatus.CANCELLED,
                    COMPLETED: entities_1.BookingStatus.COMPLETED,
                };
                processedFilters.status = statusMap[filters.status];
            }
            const result = await this.bookingUseCases.getAllBookings(page, limit, processedFilters);
            const bookingsWithSpaces = await Promise.all(result.items.map(async (booking) => {
                try {
                    const space = await this.spaceUseCases.getSpaceById(booking.getSpaceId());
                    return {
                        id: booking.id,
                        spaceId: booking.getSpaceId(),
                        space: {
                            id: space.id,
                            name: space.getName(),
                            location: space.getLocation(),
                            capacity: space.getCapacity(),
                            description: space.getDescription(),
                            active: space.isActive(),
                            createdAt: space.createdAt,
                            updatedAt: space.updatedAt,
                        },
                        clientEmail: booking.getClientEmail(),
                        date: booking.getDate(),
                        startTime: booking.getStartTime(),
                        endTime: booking.getEndTime(),
                        status: booking.getStatus(),
                        createdAt: booking.createdAt,
                        updatedAt: booking.updatedAt,
                    };
                }
                catch (error) {
                    return {
                        id: booking.id,
                        spaceId: booking.getSpaceId(),
                        space: null,
                        clientEmail: booking.getClientEmail(),
                        date: booking.getDate(),
                        startTime: booking.getStartTime(),
                        endTime: booking.getEndTime(),
                        status: booking.getStatus(),
                        createdAt: booking.createdAt,
                        updatedAt: booking.updatedAt,
                    };
                }
            }));
            return ApiResponse_1.ApiResponse.success(reply, {
                bookings: bookingsWithSpaces,
                pagination: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    totalPages: result.totalPages,
                },
            });
        }
        catch (error) {
            return ApiResponse_1.ApiResponse.error(reply, "Error getting bookings");
        }
    }
    async getById(request, reply) {
        try {
            const { id } = request.params;
            const booking = await this.bookingUseCases.getBookingById(id);
            let space = null;
            try {
                const spaceData = await this.spaceUseCases.getSpaceById(booking.getSpaceId());
                space = {
                    id: spaceData.id,
                    name: spaceData.getName(),
                    location: spaceData.getLocation(),
                    capacity: spaceData.getCapacity(),
                    description: spaceData.getDescription(),
                    active: spaceData.isActive(),
                    createdAt: spaceData.createdAt,
                    updatedAt: spaceData.updatedAt,
                };
            }
            catch (spaceError) {
            }
            const bookingData = {
                ...ApiResponse_1.EntitySerializer.booking(booking),
                space: space,
            };
            return ApiResponse_1.ApiResponse.success(reply, bookingData);
        }
        catch (error) {
            if (error instanceof Error && error.message === "Booking not found") {
                return ApiResponse_1.ApiResponse.notFound(reply, error.message);
            }
            return ApiResponse_1.ApiResponse.error(reply, "Error getting booking");
        }
    }
    async create(request, reply) {
        try {
            const validation = schemas_1.CreateBookingSchema.safeParse(request.body);
            if (!validation.success) {
                return ApiResponse_1.ApiResponse.validationError(reply, validation.error.errors);
            }
            const booking = await this.bookingUseCases.createBooking(validation.data);
            const serializedBooking = ApiResponse_1.EntitySerializer.booking(booking);
            return ApiResponse_1.ApiResponse.created(reply, serializedBooking, "Booking created successfully");
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Error creating booking";
            return ApiResponse_1.ApiResponse.badRequest(reply, message);
        }
    }
    async update(request, reply) {
        try {
            const { id } = request.params;
            const validation = schemas_1.UpdateBookingSchema.safeParse(request.body);
            if (!validation.success) {
                return ApiResponse_1.ApiResponse.validationError(reply, validation.error.errors);
            }
            const booking = await this.bookingUseCases.updateBooking({
                id,
                ...validation.data,
            });
            const serializedBooking = ApiResponse_1.EntitySerializer.booking(booking);
            return ApiResponse_1.ApiResponse.success(reply, serializedBooking);
        }
        catch (error) {
            if (error instanceof Error && error.message === "Booking not found") {
                return ApiResponse_1.ApiResponse.notFound(reply, error.message);
            }
            const message = error instanceof Error ? error.message : "Error updating booking";
            return ApiResponse_1.ApiResponse.badRequest(reply, message);
        }
    }
    async delete(request, reply) {
        try {
            const { id } = request.params;
            await this.bookingUseCases.deleteBooking(id);
            return reply.code(204).send();
        }
        catch (error) {
            if (error instanceof Error && error.message === "Booking not found") {
                return ApiResponse_1.ApiResponse.notFound(reply, error.message);
            }
            return ApiResponse_1.ApiResponse.error(reply, "Error deleting booking");
        }
    }
    async cancel(request, reply) {
        try {
            const { id } = request.params;
            const booking = await this.bookingUseCases.cancelBooking(id);
            const serializedBooking = ApiResponse_1.EntitySerializer.booking(booking);
            return ApiResponse_1.ApiResponse.success(reply, serializedBooking);
        }
        catch (error) {
            if (error instanceof Error && error.message === "Booking not found") {
                return ApiResponse_1.ApiResponse.notFound(reply, error.message);
            }
            const message = error instanceof Error ? error.message : "Error cancelling booking";
            return ApiResponse_1.ApiResponse.badRequest(reply, message);
        }
    }
}
exports.BookingsController = BookingsController;
