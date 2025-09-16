import { z } from "zod";
export declare const CreateSpaceSchema: z.ZodObject<{
    name: z.ZodString;
    location: z.ZodString;
    capacity: z.ZodNumber;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    location: string;
    capacity: number;
    description?: string | undefined;
}, {
    name: string;
    location: string;
    capacity: number;
    description?: string | undefined;
}>;
export declare const UpdateSpaceSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    capacity: z.ZodOptional<z.ZodNumber>;
    description: z.ZodOptional<z.ZodString>;
    active: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    location?: string | undefined;
    capacity?: number | undefined;
    description?: string | undefined;
    active?: boolean | undefined;
}, {
    name?: string | undefined;
    location?: string | undefined;
    capacity?: number | undefined;
    description?: string | undefined;
    active?: boolean | undefined;
}>;
export declare const SpaceFiltersSchema: z.ZodObject<{
    availableOnly: z.ZodEffects<z.ZodOptional<z.ZodString>, boolean, string | undefined>;
    capacity: z.ZodEffects<z.ZodEffects<z.ZodOptional<z.ZodString>, number | undefined, string | undefined>, number | undefined, string | undefined>;
}, "strip", z.ZodTypeAny, {
    availableOnly: boolean;
    capacity?: number | undefined;
}, {
    capacity?: string | undefined;
    availableOnly?: string | undefined;
}>;
export declare const CreateBookingSchema: z.ZodObject<{
    spaceId: z.ZodString;
    clientEmail: z.ZodString;
    date: z.ZodString;
    startTime: z.ZodString;
    endTime: z.ZodString;
}, "strip", z.ZodTypeAny, {
    spaceId: string;
    clientEmail: string;
    date: string;
    startTime: string;
    endTime: string;
}, {
    spaceId: string;
    clientEmail: string;
    date: string;
    startTime: string;
    endTime: string;
}>;
export declare const UpdateBookingSchema: z.ZodObject<{
    date: z.ZodOptional<z.ZodString>;
    startTime: z.ZodOptional<z.ZodString>;
    endTime: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    date?: string | undefined;
    startTime?: string | undefined;
    endTime?: string | undefined;
}, {
    date?: string | undefined;
    startTime?: string | undefined;
    endTime?: string | undefined;
}>;
export declare const PaginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
}, {
    page?: number | undefined;
    limit?: number | undefined;
}>;
export declare const BookingFiltersSchema: z.ZodObject<{
    spaceId: z.ZodOptional<z.ZodString>;
    clientEmail: z.ZodOptional<z.ZodString>;
    date: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["ACTIVE", "CONFIRMED", "CANCELLED", "COMPLETED"]>>;
}, "strip", z.ZodTypeAny, {
    spaceId?: string | undefined;
    clientEmail?: string | undefined;
    date?: string | undefined;
    status?: "ACTIVE" | "CANCELLED" | "COMPLETED" | "CONFIRMED" | undefined;
}, {
    spaceId?: string | undefined;
    clientEmail?: string | undefined;
    date?: string | undefined;
    status?: "ACTIVE" | "CANCELLED" | "COMPLETED" | "CONFIRMED" | undefined;
}>;
