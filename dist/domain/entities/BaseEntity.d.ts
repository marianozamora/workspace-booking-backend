export declare abstract class BaseEntity {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    protected constructor(id: string, createdAt: Date, updatedAt: Date);
}
