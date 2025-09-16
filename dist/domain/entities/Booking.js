"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = exports.BookingStatus = void 0;
const BaseEntity_1 = require("./BaseEntity");
const Email_1 = require("./Email");
const TimeSlot_1 = require("./TimeSlot");
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["ACTIVE"] = "ACTIVE";
    BookingStatus["CANCELLED"] = "CANCELLED";
    BookingStatus["COMPLETED"] = "COMPLETED";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
class Booking extends BaseEntity_1.BaseEntity {
    constructor(id, spaceId, clientEmail, date, timeSlot, status, createdAt, updatedAt) {
        super(id, createdAt, updatedAt);
        this.spaceId = spaceId;
        this.clientEmail = clientEmail;
        this.date = date;
        this.timeSlot = timeSlot;
        this.status = status;
    }
    static create(id, spaceId, clientEmail, date, startTime, endTime, status = BookingStatus.ACTIVE, createdAt = new Date(), updatedAt = new Date()) {
        return new Booking(id, spaceId, Email_1.Email.create(clientEmail), date, TimeSlot_1.TimeSlot.create(startTime, endTime), status, createdAt, updatedAt);
    }
    static createNew(id, spaceId, clientEmail, date, startTime, endTime, status = BookingStatus.ACTIVE) {
        const booking = new Booking(id, spaceId, Email_1.Email.create(clientEmail), date, TimeSlot_1.TimeSlot.create(startTime, endTime), status, new Date(), new Date());
        booking.validateDate();
        return booking;
    }
    validateDate() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (this.date < today) {
            throw new Error("Cannot book past dates");
        }
    }
    getSpaceId() {
        return this.spaceId;
    }
    getClientEmail() {
        return this.clientEmail.getValue();
    }
    getDate() {
        return this.date;
    }
    getStartTime() {
        return this.timeSlot.getStartTime();
    }
    getEndTime() {
        return this.timeSlot.getEndTime();
    }
    getStatus() {
        return this.status;
    }
    getTimeSlot() {
        return this.timeSlot;
    }
    isActive() {
        return this.status === BookingStatus.ACTIVE;
    }
    cancel() {
        if (this.status !== BookingStatus.ACTIVE) {
            throw new Error("Only active bookings can be cancelled");
        }
        this.status = BookingStatus.CANCELLED;
    }
    complete() {
        if (this.status !== BookingStatus.ACTIVE) {
            throw new Error("Only active bookings can be completed");
        }
        this.status = BookingStatus.COMPLETED;
    }
    conflictsWith(other) {
        if (this.spaceId !== other.spaceId) {
            return false;
        }
        if (this.date.getTime() !== other.date.getTime()) {
            return false;
        }
        if (!this.isActive() || !other.isActive()) {
            return false;
        }
        return this.timeSlot.overlaps(other.timeSlot);
    }
}
exports.Booking = Booking;
