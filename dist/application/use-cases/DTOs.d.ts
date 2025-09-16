export interface CreateSpaceDto {
    name: string;
    location: string;
    capacity: number;
    description?: string;
}
export interface UpdateSpaceDto {
    id: string;
    name?: string;
    location?: string;
    capacity?: number;
    description?: string;
    active?: boolean;
}
export interface CreateBookingDto {
    spaceId: string;
    clientEmail: string;
    date: string;
    startTime: string;
    endTime: string;
}
export interface UpdateBookingDto {
    id: string;
    date?: string;
    startTime?: string;
    endTime?: string;
}
