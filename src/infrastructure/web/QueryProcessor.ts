import { BookingStatus } from "@/domain/entities";

export interface QueryFilters {
	spaceId?: string;
	clientEmail?: string;
	date?: Date;
	status?: BookingStatus;
}

export interface PaginationQuery {
	page?: number;
	limit?: number;
}

export class QueryProcessor {
	static processPaginationQuery(query: any): PaginationQuery {
		return {
			page: query.page ? parseInt(query.page) : 1,
			limit: query.limit ? parseInt(query.limit) : 10,
		};
	}

	static processBookingFilters(query: any): QueryFilters {
		const filters: QueryFilters = {};

		if (query.spaceId) {
			filters.spaceId = query.spaceId;
		}

		if (query.clientEmail) {
			filters.clientEmail = query.clientEmail;
		}

		if (query.date) {
			filters.date = new Date(query.date);
		}

		if (query.status) {
			// Map string status to BookingStatus enum
			const statusMap: Record<string, BookingStatus> = {
				ACTIVE: BookingStatus.ACTIVE,
				CANCELLED: BookingStatus.CANCELLED,
				COMPLETED: BookingStatus.COMPLETED,
			};
			filters.status = statusMap[query.status];
		}

		return filters;
	}

	static createPaginationResponse<T>(
		items: T[],
		pagination: {
			page: number;
			limit: number;
			total: number;
			totalPages: number;
		}
	) {
		return {
			data: items,
			pagination: {
				page: pagination.page,
				limit: pagination.limit,
				total: pagination.total,
				totalPages: pagination.totalPages,
			},
		};
	}
}
