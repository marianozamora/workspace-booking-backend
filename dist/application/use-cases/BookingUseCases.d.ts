import { Booking } from "../../domain/entities";
import { BookingsRepository, SpacesRepository, PaginationResult, BookingFilters, Logger } from "../../domain/ports";
import { BookingValidationService } from "../../domain/services";
import { CreateBookingDto, UpdateBookingDto } from "./DTOs";
export declare class BookingUseCases {
    private readonly bookingsRepository;
    private readonly spacesRepository;
    private readonly validationService;
    private readonly logger;
    constructor(bookingsRepository: BookingsRepository, spacesRepository: SpacesRepository, validationService: BookingValidationService, logger: Logger);
    getAllBookings(page?: number, limit?: number, filters?: BookingFilters): Promise<PaginationResult<Booking>>;
    getBookingById(id: string): Promise<Booking>;
    createBooking(dto: CreateBookingDto): Promise<Booking>;
    updateBooking(dto: UpdateBookingDto): Promise<Booking>;
    cancelBooking(id: string): Promise<Booking>;
    deleteBooking(id: string): Promise<void>;
    getBookingsBySpace(spaceId: string): Promise<Booking[]>;
    getBookingsByClient(clientEmail: string): Promise<Booking[]>;
}
