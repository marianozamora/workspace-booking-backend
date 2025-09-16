import { BaseEntity } from "./BaseEntity";
import { TimeSlot } from "./TimeSlot";
export declare enum BookingStatus {
    ACTIVE = "ACTIVE",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED"
}
export declare class Booking extends BaseEntity {
    private readonly spaceId;
    private readonly clientEmail;
    private readonly date;
    private readonly timeSlot;
    private status;
    private constructor();
    static create(id: string, spaceId: string, clientEmail: string, date: Date, startTime: string, endTime: string, status?: BookingStatus, createdAt?: Date, updatedAt?: Date): Booking;
    static createNew(id: string, spaceId: string, clientEmail: string, date: Date, startTime: string, endTime: string, status?: BookingStatus): Booking;
    private validateDate;
    getSpaceId(): string;
    getClientEmail(): string;
    getDate(): Date;
    getStartTime(): string;
    getEndTime(): string;
    getStatus(): BookingStatus;
    getTimeSlot(): TimeSlot;
    isActive(): boolean;
    cancel(): void;
    complete(): void;
    conflictsWith(other: Booking): boolean;
}
