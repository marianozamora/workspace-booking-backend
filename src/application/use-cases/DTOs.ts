// DTOs for Space operations
export interface CreateSpaceDto {
	name: string;
	location: string;
	capacity: number;
	description?: string;
}

export interface UpdateSpaceDto {
	id: string;
	name?: string;
	location?: string;
	capacity?: number;
	description?: string;
	active?: boolean;
}

// DTOs for Booking operations
export interface CreateBookingDto {
	spaceId: string;
	clientEmail: string;
	date: string; // ISO date string
	startTime: string; // HH:MM
	endTime: string; // HH:MM
}

export interface UpdateBookingDto {
	id: string;
	date?: string;
	startTime?: string;
	endTime?: string;
}
