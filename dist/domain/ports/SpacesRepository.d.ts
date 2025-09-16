import { Space } from "../entities";
export interface SpacesRepository {
    findAll(): Promise<Space[]>;
    findById(id: string): Promise<Space | null>;
    create(space: Space): Promise<Space>;
    update(space: Space): Promise<Space>;
    delete(id: string): Promise<void>;
    existsById(id: string): Promise<boolean>;
}
