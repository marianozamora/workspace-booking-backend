"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaSpacesRepository = void 0;
const mappers_1 = require("./mappers");
const BaseRepository_1 = require("./BaseRepository");
class PrismaSpacesRepository extends BaseRepository_1.BaseRepository {
    constructor(prisma) {
        super(prisma, "space", new mappers_1.SpaceMapper());
    }
    async findAll() {
        const spaces = await this.prisma.space.findMany({
            orderBy: { name: "asc" },
        });
        return spaces.map(mappers_1.SpaceMapper.toDomain);
    }
}
exports.PrismaSpacesRepository = PrismaSpacesRepository;
