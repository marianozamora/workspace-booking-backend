import { Booking, BookingStatus } from "../entities";

// Pagination result
export interface PaginationResult<T> {
	items: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

// Filters for queries
export interface BookingFilters {
	spaceId?: string;
	clientEmail?: string;
	date?: Date;
	status?: BookingStatus;
}

export interface BookingsRepository {
	findAll(
		page: number,
		limit: number,
		filters?: BookingFilters
	): Promise<PaginationResult<Booking>>;
	findById(id: string): Promise<Booking | null>;
	findBySpaceAndDate(spaceId: string, date: Date): Promise<Booking[]>;
	findActiveByClientInWeek(
		clientEmail: string,
		startDate: Date,
		endDate: Date
	): Promise<Booking[]>;
	create(booking: Booking): Promise<Booking>;
	update(booking: Booking): Promise<Booking>;
	delete(id: string): Promise<void>;
	existsById(id: string): Promise<boolean>;
}
