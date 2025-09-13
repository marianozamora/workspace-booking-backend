import { BaseEntity } from "./BaseEntity";

export class Space extends BaseEntity {
	private constructor(
		id: string,
		private readonly name: string,
		private readonly location: string,
		private readonly capacity: number,
		private readonly description: string | null,
		private readonly active: boolean,
		createdAt: Date,
		updatedAt: Date
	) {
		super(id, createdAt, updatedAt);
		this.validateCapacity();
	}

	static create(
		id: string,
		name: string,
		location: string,
		capacity: number,
		description?: string,
		active: boolean = true,
		createdAt: Date = new Date(),
		updatedAt: Date = new Date()
	): Space {
		return new Space(
			id,
			name.trim(),
			location.trim(),
			capacity,
			description?.trim() || null,
			active,
			createdAt,
			updatedAt
		);
	}

	private validateCapacity(): void {
		if (this.capacity <= 0) {
			throw new Error("Capacity must be greater than 0");
		}
	}

	// Getters
	getName(): string {
		return this.name;
	}

	getLocation(): string {
		return this.location;
	}

	getCapacity(): number {
		return this.capacity;
	}

	getDescription(): string | null {
		return this.description;
	}

	isActive(): boolean {
		return this.active;
	}

	// Domain methods
	canBeBooked(): boolean {
		return this.active;
	}
}
