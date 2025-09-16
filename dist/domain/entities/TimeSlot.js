"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSlot = void 0;
class TimeSlot {
    constructor(startTime, endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
    }
    static create(startTime, endTime) {
        if (!this.isValidTime(startTime) || !this.isValidTime(endTime)) {
            throw new Error("Invalid time format. Use HH:MM");
        }
        if (this.timeToMinutes(startTime) >= this.timeToMinutes(endTime)) {
            throw new Error("Start time must be before end time");
        }
        return new TimeSlot(startTime, endTime);
    }
    static isValidTime(time) {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(time);
    }
    static timeToMinutes(time) {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    }
    getStartTime() {
        return this.startTime;
    }
    getEndTime() {
        return this.endTime;
    }
    overlaps(other) {
        const thisStart = TimeSlot.timeToMinutes(this.startTime);
        const thisEnd = TimeSlot.timeToMinutes(this.endTime);
        const otherStart = TimeSlot.timeToMinutes(other.startTime);
        const otherEnd = TimeSlot.timeToMinutes(other.endTime);
        return thisStart < otherEnd && otherStart < thisEnd;
    }
}
exports.TimeSlot = TimeSlot;
