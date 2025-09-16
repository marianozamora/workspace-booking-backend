export declare class TimeSlot {
    private readonly startTime;
    private readonly endTime;
    private constructor();
    static create(startTime: string, endTime: string): TimeSlot;
    private static isValidTime;
    private static timeToMinutes;
    getStartTime(): string;
    getEndTime(): string;
    overlaps(other: TimeSlot): boolean;
}
