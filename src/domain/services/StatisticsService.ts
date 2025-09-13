import { Booking, BookingStatus } from "../entities";
import { BookingsRepository, SpacesRepository } from "../ports";

export interface SpaceStats {
	totalBookings: number;
	activeBookings: number;
	cancelledBookings: number;
	occupancyRate: number;
}

export class StatisticsService {
	constructor(
		private readonly bookingsRepository: BookingsRepository,
		private readonly spacesRepository: SpacesRepository
	) {}

	async getSpaceStatistics(
		spaceId: string,
		month: number,
		year: number
	): Promise<SpaceStats> {
		// This method can be expanded for more complex analytics
		const startDate = new Date(year, month - 1, 1);
		const endDate = new Date(year, month, 0);

		const bookings = await this.bookingsRepository.findAll(1, 1000, {
			spaceId,
			// date: between startDate and endDate - this would require extending the filter
		});

		return {
			totalBookings: bookings.items.length,
			activeBookings: bookings.items.filter((booking) => booking.isActive())
				.length,
			cancelledBookings: bookings.items.filter(
				(booking) => booking.getStatus() === BookingStatus.CANCELLED
			).length,
			occupancyRate: this.calculateOccupancyRate(
				bookings.items,
				startDate,
				endDate
			),
		};
	}

	private calculateOccupancyRate(
		bookings: Booking[],
		startDate: Date,
		endDate: Date
	): number {
		// Simplified calculation - can be made more sophisticated
		const totalDays = Math.ceil(
			(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
		);
		const daysWithBookings = new Set(
			bookings
				.filter((booking) => booking.isActive())
				.map((booking) => booking.getDate().toDateString())
		).size;

		return (daysWithBookings / totalDays) * 100;
	}
}
