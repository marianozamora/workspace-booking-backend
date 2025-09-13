import { FastifyRequest, FastifyReply } from "fastify";
import {
	BookingUseCases,
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

export class BookingsController {
	constructor(private readonly bookingUseCases: BookingUseCases) {}

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
				return reply.code(400).send({
					error: "Bad Request",
					message: "Invalid query parameters",
				});
			}

			const { page, limit } = paginationValidation.data;
			const filters = filtersValidation.data;

			// Convert filters to proper types
			const processedFilters: any = {};
			if (filters.spaceId) processedFilters.spaceId = filters.spaceId;
			if (filters.clientEmail)
				processedFilters.clientEmail = filters.clientEmail;
			if (filters.date) processedFilters.date = new Date(filters.date);
			if (filters.status) {
				// Map string status to BookingStatus enum
				const statusMap: Record<string, BookingStatus> = {
					ACTIVE: BookingStatus.ACTIVE,
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

			return reply.send({
				success: true,
				data: result.items.map((booking) => ({
					id: booking.id,
					spaceId: booking.getSpaceId(),
					clientEmail: booking.getClientEmail(),
					date: booking.getDate(),
					startTime: booking.getStartTime(),
					endTime: booking.getEndTime(),
					status: booking.getStatus(),
					createdAt: booking.createdAt,
					updatedAt: booking.updatedAt,
				})),
				pagination: {
					page: result.page,
					limit: result.limit,
					total: result.total,
					totalPages: result.totalPages,
				},
			});
		} catch (error) {
			return reply.code(500).send({
				error: "Internal Server Error",
				message: "Error getting bookings",
			});
		}
	}

	async getById(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply
	) {
		try {
			const { id } = request.params;
			const booking = await this.bookingUseCases.getBookingById(id);

			return reply.send({
				success: true,
				data: {
					id: booking.id,
					spaceId: booking.getSpaceId(),
					clientEmail: booking.getClientEmail(),
					date: booking.getDate(),
					startTime: booking.getStartTime(),
					endTime: booking.getEndTime(),
					status: booking.getStatus(),
					createdAt: booking.createdAt,
					updatedAt: booking.updatedAt,
				},
			});
		} catch (error) {
			if (error instanceof Error && error.message === "Booking not found") {
				return reply.code(404).send({
					error: "Not Found",
					message: error.message,
				});
			}

			return reply.code(500).send({
				error: "Internal Server Error",
				message: "Error getting booking",
			});
		}
	}

	async create(
		request: FastifyRequest<{ Body: CreateBookingDto }>,
		reply: FastifyReply
	) {
		try {
			const validation = CreateBookingSchema.safeParse(request.body);

			if (!validation.success) {
				return reply.code(400).send({
					error: "Bad Request",
					message: "Invalid input data",
					details: validation.error.errors,
				});
			}

			const booking = await this.bookingUseCases.createBooking(validation.data);

			return reply.code(201).send({
				success: true,
				data: {
					id: booking.id,
					spaceId: booking.getSpaceId(),
					clientEmail: booking.getClientEmail(),
					date: booking.getDate(),
					startTime: booking.getStartTime(),
					endTime: booking.getEndTime(),
					status: booking.getStatus(),
					createdAt: booking.createdAt,
					updatedAt: booking.updatedAt,
				},
				message: "Booking created successfully",
			});
		} catch (error) {
			return reply.code(400).send({
				error: "Bad Request",
				message:
					error instanceof Error ? error.message : "Error creating booking",
			});
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
				return reply.code(400).send({
					error: "Bad Request",
					message: "Invalid input data",
					details: validation.error.errors,
				});
			}

			const booking = await this.bookingUseCases.updateBooking({
				id,
				...validation.data,
			});

			return reply.send({
				success: true,
				data: {
					id: booking.id,
					spaceId: booking.getSpaceId(),
					clientEmail: booking.getClientEmail(),
					date: booking.getDate(),
					startTime: booking.getStartTime(),
					endTime: booking.getEndTime(),
					status: booking.getStatus(),
					createdAt: booking.createdAt,
					updatedAt: booking.updatedAt,
				},
				message: "Booking updated successfully",
			});
		} catch (error) {
			if (error instanceof Error && error.message === "Booking not found") {
				return reply.code(404).send({
					error: "Not Found",
					message: error.message,
				});
			}

			return reply.code(400).send({
				error: "Bad Request",
				message:
					error instanceof Error ? error.message : "Error updating booking",
			});
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
				return reply.code(404).send({
					error: "Not Found",
					message: error.message,
				});
			}

			return reply.code(500).send({
				error: "Internal Server Error",
				message: "Error deleting booking",
			});
		}
	}

	async cancel(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply
	) {
		try {
			const { id } = request.params;
			const booking = await this.bookingUseCases.cancelBooking(id);

			return reply.send({
				success: true,
				data: {
					id: booking.id,
					spaceId: booking.getSpaceId(),
					clientEmail: booking.getClientEmail(),
					date: booking.getDate(),
					startTime: booking.getStartTime(),
					endTime: booking.getEndTime(),
					status: booking.getStatus(),
					createdAt: booking.createdAt,
					updatedAt: booking.updatedAt,
				},
				message: "Booking cancelled successfully",
			});
		} catch (error) {
			if (error instanceof Error && error.message === "Booking not found") {
				return reply.code(404).send({
					error: "Not Found",
					message: error.message,
				});
			}

			return reply.code(400).send({
				error: "Bad Request",
				message:
					error instanceof Error ? error.message : "Error cancelling booking",
			});
		}
	}
}
