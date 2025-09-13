import { Booking, Space, BookingStatus } from "../entities";
import {
	BookingsRepository,
	SpacesRepository,
	DateService,
	ValidationResult,
} from "../ports";

export class BookingValidationService {
	constructor(
		private readonly bookingsRepository: BookingsRepository,
		private readonly spacesRepository: SpacesRepository,
		private readonly dateService: DateService
	) {}

	async validateNewBooking(
		spaceId: string,
		clientEmail: string,
		date: Date,
		startTime: string,
		endTime: string
	): Promise<ValidationResult> {
		const errors: string[] = [];

		// 1. Validate that the space exists and is active
		const space = await this.spacesRepository.findById(spaceId);
		if (!space) {
			errors.push("The specified space does not exist");
			return { isValid: false, errors };
		}

		if (!space.canBeBooked()) {
			errors.push("The space is not available for bookings");
		}

		// 2. Validate client booking limit (3 per week)
		const limitValidation = await this.validateClientBookingLimit(
			clientEmail,
			date
		);

		if (!limitValidation.isValid) {
			errors.push(...limitValidation.errors);
		}

		// 3. Validate time slot conflicts
		const conflictValidation = await this.validateTimeSlotConflicts(
			spaceId,
			date,
			startTime,
			endTime
		);

		if (!conflictValidation.isValid) {
			errors.push(...conflictValidation.errors);
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}

	private async validateClientBookingLimit(
		clientEmail: string,
		date: Date
	): Promise<ValidationResult> {
		const startOfWeek = this.dateService.startOfWeek(date);
		const endOfWeek = this.dateService.endOfWeek(date);

		const activeBookings =
			await this.bookingsRepository.findActiveByClientInWeek(
				clientEmail,
				startOfWeek,
				endOfWeek
			);

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

	private async validateTimeSlotConflicts(
		spaceId: string,
		date: Date,
		startTime: string,
		endTime: string,
		excludeBookingId?: string
	): Promise<ValidationResult> {
		const existingBookings = await this.bookingsRepository.findBySpaceAndDate(
			spaceId,
			date
		);

		// Filter active bookings and exclude current booking if editing
		const activeBookings = existingBookings.filter(
			(booking) => booking.isActive() && booking.id !== excludeBookingId
		);

		// Create temporary booking to validate conflicts
		try {
			const tempBooking = Booking.create(
				"temp",
				spaceId,
				"temp@test.com",
				date,
				startTime,
				endTime
			);

			const conflictingBooking = activeBookings.find((booking) =>
				tempBooking.conflictsWith(booking)
			);

			if (conflictingBooking) {
				return {
					isValid: false,
					errors: [
						`A booking already exists in that time slot (${conflictingBooking.getStartTime()}-${conflictingBooking.getEndTime()})`,
					],
				};
			}

			return { isValid: true, errors: [] };
		} catch (error) {
			return {
				isValid: false,
				errors: [
					error instanceof Error
						? error.message
						: "Error in time slot validation",
				],
			};
		}
	}
}
