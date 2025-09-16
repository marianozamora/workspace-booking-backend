import { BaseEntity } from "./BaseEntity";
export declare class Space extends BaseEntity {
    private readonly name;
    private readonly location;
    private readonly capacity;
    private readonly description;
    private readonly active;
    private constructor();
    static create(id: string, name: string, location: string, capacity: number, description?: string, active?: boolean, createdAt?: Date, updatedAt?: Date): Space;
    private validateCapacity;
    getName(): string;
    getLocation(): string;
    getCapacity(): number;
    getDescription(): string | null;
    isActive(): boolean;
    canBeBooked(): boolean;
}
