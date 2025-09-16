"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingValidationService = void 0;
const entities_1 = require("../entities");
class BookingValidationService {
    constructor(bookingsRepository, spacesRepository, dateService) {
        this.bookingsRepository = bookingsRepository;
        this.spacesRepository = spacesRepository;
        this.dateService = dateService;
    }
    async validateNewBooking(spaceId, clientEmail, date, startTime, endTime) {
        const errors = [];
        const space = await this.spacesRepository.findById(spaceId);
        if (!space) {
            errors.push("The specified space does not exist");
            return { isValid: false, errors };
        }
        if (!space.canBeBooked()) {
            errors.push("The space is not available for bookings");
        }
        const limitValidation = await this.validateClientBookingLimit(clientEmail, date);
        if (!limitValidation.isValid) {
            errors.push(...limitValidation.errors);
        }
        const conflictValidation = await this.validateTimeSlotConflicts(spaceId, date, startTime, endTime);
        if (!conflictValidation.isValid) {
            errors.push(...conflictValidation.errors);
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
    async validateClientBookingLimit(clientEmail, date) {
        const startOfWeek = this.dateService.getStartOfWeek(date);
        const endOfWeek = this.dateService.getEndOfWeek(date);
        const activeBookings = await this.bookingsRepository.findActiveByClientInWeek(clientEmail, startOfWeek, endOfWeek);
        const MAX_BOOKINGS_PER_WEEK = 3;
        if (activeBookings.length >= MAX_BOOKINGS_PER_WEEK) {
            return {
                isValid: false,
                errors: [
                    `You have reached the limit of ${MAX_BOOKINGS_PER_WEEK} bookings per week`,
                ],
            };
        }
        return { isValid: true, errors: [] };
    }
    async validateTimeSlotConflicts(spaceId, date, startTime, endTime, excludeBookingId) {
        const existingBookings = await this.bookingsRepository.findBySpaceAndDate(spaceId, date);
        const activeBookings = existingBookings.filter(booking => booking.isActive() && booking.id !== excludeBookingId);
        try {
            const tempBooking = entities_1.Booking.create("temp", spaceId, "temp@test.com", date, startTime, endTime);
            const conflictingBooking = activeBookings.find(booking => tempBooking.conflictsWith(booking));
            if (conflictingBooking) {
                return {
                    isValid: false,
                    errors: [
                        `A booking already exists in that time slot (${conflictingBooking.getStartTime()}-${conflictingBooking.getEndTime()})`,
                    ],
                };
            }
            return { isValid: true, errors: [] };
        }
        catch (error) {
            return {
                isValid: false,
                errors: [
                    error instanceof Error ? error.message : "Error in time slot validation",
                ],
            };
        }
    }
}
exports.BookingValidationService = BookingValidationService;
