export interface Logger {
	info(message: string, data?: any): void;
	error(message: string, error?: Error, data?: any): void;
	warn(message: string, data?: any): void;
	debug(message: string, data?: any): void;
}

export interface DateService {
	now(): Date;
	addDays(date: Date, days: number): Date;
	startOfWeek(date: Date): Date;
	endOfWeek(date: Date): Date;
	isSameDate(date1: Date, date2: Date): boolean;
	formatDate(date: Date): string;
}
