import { Booking } from "../entities";
import { BookingsRepository } from "../ports";

export interface TimeSlotAvailability {
	startTime: string;
	endTime: string;
	available: boolean;
	bookingId: string | null;
}

export class AvailabilityService {
	constructor(private readonly bookingsRepository: BookingsRepository) {}

	async getSpaceAvailability(
		spaceId: string,
		date: Date
	): Promise<TimeSlotAvailability[]> {
		const dayBookings = await this.bookingsRepository.findBySpaceAndDate(
			spaceId,
			date
		);

		const activeBookings = dayBookings.filter((booking) => booking.isActive());

		// Working hours: 8:00 AM - 6:00 PM (configurable)
		const workingHoursStart = "08:00";
		const workingHoursEnd = "18:00";

		return this.calculateAvailableSlots(
			workingHoursStart,
			workingHoursEnd,
			activeBookings
		);
	}

	private calculateAvailableSlots(
		workingHoursStart: string,
		workingHoursEnd: string,
		activeBookings: Booking[]
	): TimeSlotAvailability[] {
		const slots: TimeSlotAvailability[] = [];

		// Sort bookings by start time
		const sortedBookings = activeBookings.sort((a, b) =>
			a.getStartTime().localeCompare(b.getStartTime())
		);

		let currentTime = workingHoursStart;

		for (const booking of sortedBookings) {
			// If there's free time before the booking
			if (currentTime < booking.getStartTime()) {
				slots.push({
					startTime: currentTime,
					endTime: booking.getStartTime(),
					available: true,
					bookingId: null,
				});
			}

			// Add occupied slot
			slots.push({
				startTime: booking.getStartTime(),
				endTime: booking.getEndTime(),
				available: false,
				bookingId: booking.id,
			});

			currentTime = booking.getEndTime();
		}

		// If there's free time at the end
		if (currentTime < workingHoursEnd) {
			slots.push({
				startTime: currentTime,
				endTime: workingHoursEnd,
				available: true,
				bookingId: null,
			});
		}

		return slots;
	}
}
