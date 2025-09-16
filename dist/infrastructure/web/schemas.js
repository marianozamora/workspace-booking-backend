"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingFiltersSchema = exports.PaginationSchema = exports.UpdateBookingSchema = exports.CreateBookingSchema = exports.SpaceFiltersSchema = exports.UpdateSpaceSchema = exports.CreateSpaceSchema = void 0;
const zod_1 = require("zod");
exports.CreateSpaceSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required").max(100),
    location: zod_1.z.string().min(1, "Location is required").max(200),
    capacity: zod_1.z.number().min(1, "Capacity must be greater than 0").max(1000),
    description: zod_1.z.string().max(500).optional(),
});
exports.UpdateSpaceSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100).optional(),
    location: zod_1.z.string().min(1).max(200).optional(),
    capacity: zod_1.z.number().min(1).max(1000).optional(),
    description: zod_1.z.string().max(500).optional(),
    active: zod_1.z.boolean().optional(),
});
exports.SpaceFiltersSchema = zod_1.z.object({
    availableOnly: zod_1.z
        .string()
        .optional()
        .transform(val => val === "true" || val === "1"),
    capacity: zod_1.z
        .string()
        .optional()
        .transform(val => (val ? parseInt(val, 10) : undefined))
        .refine(val => val === undefined || val > 0, "Capacity must be greater than 0"),
});
exports.CreateBookingSchema = zod_1.z.object({
    spaceId: zod_1.z.string().min(1, "Space ID is required"),
    clientEmail: zod_1.z.string().email("Invalid email"),
    date: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must have format YYYY-MM-DD"),
    startTime: zod_1.z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Start time format HH:MM"),
    endTime: zod_1.z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "End time format HH:MM"),
});
exports.UpdateBookingSchema = zod_1.z.object({
    date: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .optional(),
    startTime: zod_1.z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .optional(),
    endTime: zod_1.z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .optional(),
});
exports.PaginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10),
});
exports.BookingFiltersSchema = zod_1.z.object({
    spaceId: zod_1.z.string().min(1).optional(),
    clientEmail: zod_1.z.string().optional(),
    date: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .optional(),
    status: zod_1.z.enum(["ACTIVE", "CONFIRMED", "CANCELLED", "COMPLETED"]).optional(),
});
