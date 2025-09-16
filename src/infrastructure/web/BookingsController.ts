import { FastifyRequest, FastifyReply } from "fastify";
import {
	BookingUseCases,
	SpaceUseCases,
	CreateBookingDto,
	UpdateBookingDto,
} from "@/application/use-cases";
import { BookingStatus } from "@/domain/entities";
import {
	CreateBookingSchema,
	UpdateBookingSchema,
	PaginationSchema,
	BookingFiltersSchema,
} from "./schemas";
import { ApiResponse, EntitySerializer } from "./ApiResponse";

export class BookingsController {
	constructor(
		private readonly bookingUseCases: BookingUseCases,
		private readonly spaceUseCases: SpaceUseCases
	) {}

	async getAll(
		request: FastifyRequest<{
			Querystring: {
				page?: number;
				limit?: number;
				spaceId?: string;
				clientEmail?: string;
				date?: string;
				status?: string;
			};
		}>,
		reply: FastifyReply
	) {
		try {
			const paginationValidation = PaginationSchema.safeParse(request.query);
			const filtersValidation = BookingFiltersSchema.safeParse(request.query);

			if (!paginationValidation.success || !filtersValidation.success) {
				return ApiResponse.badRequest(reply, "Invalid query parameters");
			}

			const { page, limit } = paginationValidation.data;
			const filters = filtersValidation.data;

			// Convert filters to proper types
			const processedFilters: any = {};
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
				// Map string status to BookingStatus enum
				const statusMap: Record<string, BookingStatus> = {
					ACTIVE: BookingStatus.ACTIVE,
					CONFIRMED: BookingStatus.ACTIVE, // Map frontend CONFIRMED to backend ACTIVE
					CANCELLED: BookingStatus.CANCELLED,
					COMPLETED: BookingStatus.COMPLETED,
				};
				processedFilters.status = statusMap[filters.status];
			}

			const result = await this.bookingUseCases.getAllBookings(
				page,
				limit,
				processedFilters
			);

			// Fetch space data for each booking
			const bookingsWithSpaces = await Promise.all(
				result.items.map(async booking => {
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
					} catch (error) {
						// If space not found, return booking without space data
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
				})
			);

			return ApiResponse.success(reply, {
				bookings: bookingsWithSpaces,
				pagination: {
					page: result.page,
					limit: result.limit,
					total: result.total,
					totalPages: result.totalPages,
				},
			});
		} catch (error) {
			return ApiResponse.error(reply, "Error getting bookings");
		}
	}

	async getById(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply
	) {
		try {
			const { id } = request.params;
			const booking = await this.bookingUseCases.getBookingById(id);

			// Fetch space data
			let space = null;
			try {
				const spaceData = await this.spaceUseCases.getSpaceById(
					booking.getSpaceId()
				);
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
			} catch (spaceError) {
				// Space not found, continue without space data
			}

			const bookingData = {
				...EntitySerializer.booking(booking),
				space: space,
			};
			return ApiResponse.success(reply, bookingData);
		} catch (error) {
			if (error instanceof Error && error.message === "Booking not found") {
				return ApiResponse.notFound(reply, error.message);
			}
			return ApiResponse.error(reply, "Error getting booking");
		}
	}

	async create(
		request: FastifyRequest<{ Body: CreateBookingDto }>,
		reply: FastifyReply
	) {
		try {
			const validation = CreateBookingSchema.safeParse(request.body);

			if (!validation.success) {
				return ApiResponse.validationError(reply, validation.error.errors);
			}

			const booking = await this.bookingUseCases.createBooking(validation.data);
			const serializedBooking = EntitySerializer.booking(booking);
			return ApiResponse.created(
				reply,
				serializedBooking,
				"Booking created successfully"
			);
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Error creating booking";
			return ApiResponse.badRequest(reply, message);
		}
	}

	async update(
		request: FastifyRequest<{
			Params: { id: string };
			Body: Omit<UpdateBookingDto, "id">;
		}>,
		reply: FastifyReply
	) {
		try {
			const { id } = request.params;
			const validation = UpdateBookingSchema.safeParse(request.body);

			if (!validation.success) {
				return ApiResponse.validationError(reply, validation.error.errors);
			}

			const booking = await this.bookingUseCases.updateBooking({
				id,
				...validation.data,
			});

			const serializedBooking = EntitySerializer.booking(booking);
			return ApiResponse.success(reply, serializedBooking);
		} catch (error) {
			if (error instanceof Error && error.message === "Booking not found") {
				return ApiResponse.notFound(reply, error.message);
			}
			const message =
				error instanceof Error ? error.message : "Error updating booking";
			return ApiResponse.badRequest(reply, message);
		}
	}

	async delete(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply
	) {
		try {
			const { id } = request.params;
			await this.bookingUseCases.deleteBooking(id);

			return reply.code(204).send();
		} catch (error) {
			if (error instanceof Error && error.message === "Booking not found") {
				return ApiResponse.notFound(reply, error.message);
			}
			return ApiResponse.error(reply, "Error deleting booking");
		}
	}

	async cancel(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply
	) {
		try {
			const { id } = request.params;
			const booking = await this.bookingUseCases.cancelBooking(id);

			const serializedBooking = EntitySerializer.booking(booking);
			return ApiResponse.success(reply, serializedBooking);
		} catch (error) {
			if (error instanceof Error && error.message === "Booking not found") {
				return ApiResponse.notFound(reply, error.message);
			}
			const message =
				error instanceof Error ? error.message : "Error cancelling booking";
			return ApiResponse.badRequest(reply, message);
		}
	}
}
