import { DateService } from "@/domain/ports";

export class DateServiceImpl implements DateService {
	getCurrentDate(): Date {
		return new Date();
	}

	now(): Date {
		return new Date();
	}

	parseDate(dateString: string): Date {
		return new Date(dateString);
	}

	addDays(date: Date, days: number): Date {
		const result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
	}

	getStartOfWeek(date: Date): Date {
		const result = new Date(date);
		const day = result.getDay();
		const diff = result.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
		result.setDate(diff);
		result.setHours(0, 0, 0, 0);
		return result;
	}

	startOfWeek(date: Date): Date {
		return this.getStartOfWeek(date);
	}

	getEndOfWeek(date: Date): Date {
		const result = this.getStartOfWeek(date);
		result.setDate(result.getDate() + 6);
		result.setHours(23, 59, 59, 999);
		return result;
	}

	endOfWeek(date: Date): Date {
		return this.getEndOfWeek(date);
	}

	isSameDate(date1: Date, date2: Date): boolean {
		return date1.toDateString() === date2.toDateString();
	}

	formatDate(date: Date): string {
		return date.toISOString().split("T")[0];
	}
}
