"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(prisma, modelName, mapper) {
        this.prisma = prisma;
        this.modelName = modelName;
        this.mapper = mapper;
    }
    async findById(id) {
        const model = this.prisma[this.modelName];
        const result = await model.findUnique({
            where: { id },
        });
        return result ? this.mapper.toDomain(result) : null;
    }
    async create(entity) {
        const data = this.mapper.toPrisma(entity);
        const model = this.prisma[this.modelName];
        const created = await model.create({
            data,
        });
        return this.mapper.toDomain(created);
    }
    async update(entity) {
        const data = this.mapper.toPrisma(entity);
        const model = this.prisma[this.modelName];
        const updated = await model.update({
            where: { id: entity.id },
            data,
        });
        return this.mapper.toDomain(updated);
    }
    async delete(id) {
        const model = this.prisma[this.modelName];
        await model.delete({
            where: { id },
        });
    }
    async existsById(id) {
        const model = this.prisma[this.modelName];
        const count = await model.count({
            where: { id },
        });
        return count > 0;
    }
}
exports.BaseRepository = BaseRepository;
