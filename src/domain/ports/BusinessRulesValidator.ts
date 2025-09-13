export interface ValidationResult {
	isValid: boolean;
	errors: string[];
}

export interface BusinessRulesValidator {
	validateBookingLimits(
		clientEmail: string,
		date: Date
	): Promise<ValidationResult>;

	validateTimeSlotAvailability(
		spaceId: string,
		date: Date,
		startTime: string,
		endTime: string,
		excludeBookingId?: string
	): Promise<ValidationResult>;
}
