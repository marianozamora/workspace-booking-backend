// Common interfaces used across the domain
export interface Logger {
	info(message: string, data?: any): void;
	error(message: string, error?: Error, data?: any): void;
	warn(message: string, data?: any): void;
	debug(message: string, data?: any): void;
}

export interface DateService {
	getCurrentDate(): Date;
	formatDate(date: Date): string;
	parseDate(dateString: string): Date;
	addDays(date: Date, days: number): Date;
	getStartOfWeek(date: Date): Date;
	getEndOfWeek(date: Date): Date;
}

export interface ValidationResult {
	isValid: boolean;
	errors: string[];
}
