import { DateService } from "../../domain/ports";
export declare class DateServiceImpl implements DateService {
    getCurrentDate(): Date;
    now(): Date;
    parseDate(dateString: string): Date;
    addDays(date: Date, days: number): Date;
    getStartOfWeek(date: Date): Date;
    startOfWeek(date: Date): Date;
    getEndOfWeek(date: Date): Date;
    endOfWeek(date: Date): Date;
    isSameDate(date1: Date, date2: Date): boolean;
    formatDate(date: Date): string;
}
