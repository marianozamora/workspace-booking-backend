import { DateService } from "@/domain/ports";

export class DateServiceImpl implements DateService {
	now(): Date {
		return new Date();
	}

	addDays(date: Date, days: number): Date {
		const result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
	}

	startOfWeek(date: Date): Date {
		const result = new Date(date);
		const day = result.getDay();
		const diff = result.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
		result.setDate(diff);
		result.setHours(0, 0, 0, 0);
		return result;
	}

	endOfWeek(date: Date): Date {
		const result = this.startOfWeek(date);
		result.setDate(result.getDate() + 6);
		result.setHours(23, 59, 59, 999);
		return result;
	}

	isSameDate(date1: Date, date2: Date): boolean {
		return date1.toDateString() === date2.toDateString();
	}

	formatDate(date: Date): string {
		return date.toISOString().split("T")[0];
	}
}
