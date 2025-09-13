import { z } from "zod";

// Validation schemas using Zod
export const CreateSpaceSchema = z.object({
	name: z.string().min(1, "Name is required").max(100),
	location: z.string().min(1, "Location is required").max(200),
	capacity: z.number().min(1, "Capacity must be greater than 0").max(1000),
	description: z.string().max(500).optional(),
});

export const UpdateSpaceSchema = z.object({
	name: z.string().min(1).max(100).optional(),
	location: z.string().min(1).max(200).optional(),
	capacity: z.number().min(1).max(1000).optional(),
	description: z.string().max(500).optional(),
	active: z.boolean().optional(),
});

export const CreateBookingSchema = z.object({
	spaceId: z.string().uuid("Space ID must be a valid UUID"),
	clientEmail: z.string().email("Invalid email"),
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, "Date must have format YYYY-MM-DD"),
	startTime: z
		.string()
		.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Start time format HH:MM"),
	endTime: z
		.string()
		.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "End time format HH:MM"),
});

export const UpdateBookingSchema = z.object({
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.optional(),
	startTime: z
		.string()
		.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
		.optional(),
	endTime: z
		.string()
		.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
		.optional(),
});

export const PaginationSchema = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(10),
});

export const BookingFiltersSchema = z.object({
	spaceId: z.string().uuid().optional(),
	clientEmail: z.string().optional(),
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.optional(),
	status: z.enum(["ACTIVE", "CANCELLED", "COMPLETED"]).optional(),
});
