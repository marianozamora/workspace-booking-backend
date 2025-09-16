"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateServiceImpl = void 0;
class DateServiceImpl {
    getCurrentDate() {
        return new Date();
    }
    now() {
        return new Date();
    }
    parseDate(dateString) {
        return new Date(dateString);
    }
    addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
    getStartOfWeek(date) {
        const result = new Date(date);
        const day = result.getDay();
        const diff = result.getDate() - day + (day === 0 ? -6 : 1);
        result.setDate(diff);
        result.setHours(0, 0, 0, 0);
        return result;
    }
    startOfWeek(date) {
        return this.getStartOfWeek(date);
    }
    getEndOfWeek(date) {
        const result = this.getStartOfWeek(date);
        result.setDate(result.getDate() + 6);
        result.setHours(23, 59, 59, 999);
        return result;
    }
    endOfWeek(date) {
        return this.getEndOfWeek(date);
    }
    isSameDate(date1, date2) {
        return date1.toDateString() === date2.toDateString();
    }
    formatDate(date) {
        return date.toISOString().split("T")[0];
    }
}
exports.DateServiceImpl = DateServiceImpl;
