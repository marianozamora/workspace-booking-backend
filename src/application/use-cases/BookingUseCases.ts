import { randomUUID } from "crypto";
import { Booking } from "@/domain/entities";
import {
	BookingsRepository,
	SpacesRepository,
	PaginationResult,
	BookingFilters,
	Logger,
} from "@/domain/ports";
import { BookingValidationService } from "@/domain/services";
import { CreateBookingDto, UpdateBookingDto } from "./DTOs";

export class BookingUseCases {
	constructor(
		private readonly bookingsRepository: BookingsRepository,
		private readonly spacesRepository: SpacesRepository,
		private readonly validationService: BookingValidationService,
		private readonly logger: Logger
	) {}

	async getAllBookings(
		page: number = 1,
		limit: number = 10,
		filters?: BookingFilters
	): Promise<PaginationResult<Booking>> {
		this.logger.info("Getting bookings with pagination", {
			page,
			limit,
			filters,
		});

		return this.bookingsRepository.findAll(page, limit, filters);
	}

	async getBookingById(id: string): Promise<Booking> {
		this.logger.info("Getting booking by ID", { id });

		const booking = await this.bookingsRepository.findById(id);
		if (!booking) {
			throw new Error("Booking not found");
		}

		return booking;
	}

	async createBooking(dto: CreateBookingDto): Promise<Booking> {
		this.logger.info("Creating new booking", {
			spaceId: dto.spaceId,
			clientEmail: dto.clientEmail,
			date: dto.date,
		});

		const date = new Date(dto.date);

		// Validate business rules
		const validation = await this.validationService.validateNewBooking(
			dto.spaceId,
			dto.clientEmail,
			date,
			dto.startTime,
			dto.endTime
		);

		if (!validation.isValid) {
			const error = new Error(`Validation error: ${validation.errors.join(", ")}`);
			this.logger.error("Error in booking validation", error, dto);
			throw error;
		}

		// Create domain entity
		const booking = Booking.createNew(
			randomUUID(),
			dto.spaceId,
			dto.clientEmail,
			date,
			dto.startTime,
			dto.endTime
		);

		// Persist
		const createdBooking = await this.bookingsRepository.create(booking);

		this.logger.info("Booking created successfully", {
			id: createdBooking.id,
			spaceId: dto.spaceId,
			date: dto.date,
		});

		return createdBooking;
	}

	async updateBooking(dto: UpdateBookingDto): Promise<Booking> {
		this.logger.info("Updating booking", { id: dto.id });

		const existingBooking = await this.getBookingById(dto.id);

		if (!existingBooking.isActive()) {
			throw new Error("Only active bookings can be modified");
		}

		const newDate = dto.date ? new Date(dto.date) : existingBooking.getDate();
		const newStartTime = dto.startTime ?? existingBooking.getStartTime();
		const newEndTime = dto.endTime ?? existingBooking.getEndTime();

		// If date/times are modified, validate conflicts
		if (dto.date || dto.startTime || dto.endTime) {
			const validation = await this.validationService.validateNewBooking(
				existingBooking.getSpaceId(),
				existingBooking.getClientEmail(),
				newDate,
				newStartTime,
				newEndTime
			);

			if (!validation.isValid) {
				throw new Error(`Validation error: ${validation.errors.join(", ")}`);
			}
		}

		// Create new updated instance
		const updatedBooking = Booking.create(
			existingBooking.id,
			existingBooking.getSpaceId(),
			existingBooking.getClientEmail(),
			newDate,
			newStartTime,
			newEndTime,
			existingBooking.getStatus(),
			existingBooking.createdAt,
			new Date()
		);

		const savedBooking = await this.bookingsRepository.update(updatedBooking);

		this.logger.info("Booking updated successfully", { id: dto.id });

		return savedBooking;
	}

	async cancelBooking(id: string): Promise<Booking> {
		this.logger.info("Cancelling booking", { id });

		const booking = await this.getBookingById(id);

		// Use domain method to cancel
		booking.cancel();

		const updatedBooking = await this.bookingsRepository.update(booking);

		this.logger.info("Booking cancelled successfully", { id });

		return updatedBooking;
	}

	async deleteBooking(id: string): Promise<void> {
		this.logger.info("Deleting booking", { id });

		const exists = await this.bookingsRepository.existsById(id);
		if (!exists) {
			throw new Error("Booking not found");
		}

		await this.bookingsRepository.delete(id);

		this.logger.info("Booking deleted successfully", { id });
	}

	async getBookingsBySpace(spaceId: string): Promise<Booking[]> {
		this.logger.info("Getting bookings by space", { spaceId });

		// Verify that the space exists
		const spaceExists = await this.spacesRepository.existsById(spaceId);
		if (!spaceExists) {
			throw new Error("Space not found");
		}

		const result = await this.bookingsRepository.findAll(1, 1000, {
			spaceId,
		});
		return result.items;
	}

	async getBookingsByClient(clientEmail: string): Promise<Booking[]> {
		this.logger.info("Getting bookings by client", { clientEmail });

		const result = await this.bookingsRepository.findAll(1, 1000, {
			clientEmail,
		});
		return result.items;
	}
}
