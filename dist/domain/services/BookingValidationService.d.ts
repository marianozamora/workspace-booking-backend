import { BookingsRepository, SpacesRepository, DateService, ValidationResult } from "../ports";
export declare class BookingValidationService {
    private readonly bookingsRepository;
    private readonly spacesRepository;
    private readonly dateService;
    constructor(bookingsRepository: BookingsRepository, spacesRepository: SpacesRepository, dateService: DateService);
    validateNewBooking(spaceId: string, clientEmail: string, date: Date, startTime: string, endTime: string): Promise<ValidationResult>;
    private validateClientBookingLimit;
    private validateTimeSlotConflicts;
}
