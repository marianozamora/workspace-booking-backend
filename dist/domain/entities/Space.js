"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Space = void 0;
const BaseEntity_1 = require("./BaseEntity");
class Space extends BaseEntity_1.BaseEntity {
    constructor(id, name, location, capacity, description, active, createdAt, updatedAt) {
        super(id, createdAt, updatedAt);
        this.name = name;
        this.location = location;
        this.capacity = capacity;
        this.description = description;
        this.active = active;
        this.validateCapacity();
    }
    static create(id, name, location, capacity, description, active = true, createdAt = new Date(), updatedAt = new Date()) {
        return new Space(id, name.trim(), location.trim(), capacity, description?.trim() || null, active, createdAt, updatedAt);
    }
    validateCapacity() {
        if (this.capacity <= 0) {
            throw new Error("Capacity must be greater than 0");
        }
    }
    getName() {
        return this.name;
    }
    getLocation() {
        return this.location;
    }
    getCapacity() {
        return this.capacity;
    }
    getDescription() {
        return this.description;
    }
    isActive() {
        return this.active;
    }
    canBeBooked() {
        return this.active;
    }
}
exports.Space = Space;
