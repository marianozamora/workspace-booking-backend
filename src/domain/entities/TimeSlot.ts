export class TimeSlot {
	private constructor(
		private readonly startTime: string,
		private readonly endTime: string
	) {}

	static create(startTime: string, endTime: string): TimeSlot {
		if (!this.isValidTime(startTime) || !this.isValidTime(endTime)) {
			throw new Error("Invalid time format. Use HH:MM");
		}

		if (this.timeToMinutes(startTime) >= this.timeToMinutes(endTime)) {
			throw new Error("Start time must be before end time");
		}

		return new TimeSlot(startTime, endTime);
	}

	private static isValidTime(time: string): boolean {
		const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
		return timeRegex.test(time);
	}

	private static timeToMinutes(time: string): number {
		const [hours, minutes] = time.split(":").map(Number);
		return hours * 60 + minutes;
	}

	getStartTime(): string {
		return this.startTime;
	}

	getEndTime(): string {
		return this.endTime;
	}

	overlaps(other: TimeSlot): boolean {
		const thisStart = TimeSlot.timeToMinutes(this.startTime);
		const thisEnd = TimeSlot.timeToMinutes(this.endTime);
		const otherStart = TimeSlot.timeToMinutes(other.startTime);
		const otherEnd = TimeSlot.timeToMinutes(other.endTime);

		return thisStart < otherEnd && otherStart < thisEnd;
	}
}
