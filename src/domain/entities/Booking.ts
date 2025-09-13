import { BaseEntity } from "./BaseEntity";
import { Email } from "./Email";
import { TimeSlot } from "./TimeSlot";

export enum BookingStatus {
	ACTIVE = "ACTIVE",
	CANCELLED = "CANCELLED",
	COMPLETED = "COMPLETED",
}

export class Booking extends BaseEntity {
	private constructor(
		id: string,
		private readonly spaceId: string,
		private readonly clientEmail: Email,
		private readonly date: Date,
		private readonly timeSlot: TimeSlot,
		private status: BookingStatus,
		createdAt: Date,
		updatedAt: Date
	) {
		super(id, createdAt, updatedAt);
		this.validateDate();
	}

	static create(
		id: string,
		spaceId: string,
		clientEmail: string,
		date: Date,
		startTime: string,
		endTime: string,
		status: BookingStatus = BookingStatus.ACTIVE,
		createdAt: Date = new Date(),
		updatedAt: Date = new Date()
	): Booking {
		return new Booking(
			id,
			spaceId,
			Email.create(clientEmail),
			date,
			TimeSlot.create(startTime, endTime),
			status,
			createdAt,
			updatedAt
		);
	}

	private validateDate(): void {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		if (this.date < today) {
			throw new Error("Cannot book past dates");
		}
	}

	// Getters
	getSpaceId(): string {
		return this.spaceId;
	}

	getClientEmail(): string {
		return this.clientEmail.getValue();
	}

	getDate(): Date {
		return this.date;
	}

	getStartTime(): string {
		return this.timeSlot.getStartTime();
	}

	getEndTime(): string {
		return this.timeSlot.getEndTime();
	}

	getStatus(): BookingStatus {
		return this.status;
	}

	getTimeSlot(): TimeSlot {
		return this.timeSlot;
	}

	// Domain methods
	isActive(): boolean {
		return this.status === BookingStatus.ACTIVE;
	}

	cancel(): void {
		if (this.status !== BookingStatus.ACTIVE) {
			throw new Error("Only active bookings can be cancelled");
		}
		this.status = BookingStatus.CANCELLED;
	}

	complete(): void {
		if (this.status !== BookingStatus.ACTIVE) {
			throw new Error("Only active bookings can be completed");
		}
		this.status = BookingStatus.COMPLETED;
	}

	conflictsWith(other: Booking): boolean {
		if (this.spaceId !== other.spaceId) {
			return false;
		}

		if (this.date.getTime() !== other.date.getTime()) {
			return false;
		}

		if (!this.isActive() || !other.isActive()) {
			return false;
		}

		return this.timeSlot.overlaps(other.timeSlot);
	}
}
