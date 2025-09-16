"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntitySerializer = exports.ApiResponse = void 0;
class ApiResponse {
    static success(reply, data, statusCode = 200) {
        return reply.code(statusCode).send({
            success: true,
            data,
        });
    }
    static created(reply, data, message) {
        const response = {
            success: true,
            data,
        };
        if (message) {
            response.message = message;
        }
        return reply.code(201).send(response);
    }
    static error(reply, message, statusCode = 500, errorType = "Internal Server Error") {
        return reply.code(statusCode).send({
            error: errorType,
            message,
        });
    }
    static notFound(reply, message = "Resource not found") {
        return this.error(reply, message, 404, "Not Found");
    }
    static badRequest(reply, message = "Bad Request") {
        return this.error(reply, message, 400, "Bad Request");
    }
    static validationError(reply, errors) {
        return reply.code(400).send({
            error: "Validation Error",
            message: "Invalid input data",
            details: errors,
        });
    }
}
exports.ApiResponse = ApiResponse;
class EntitySerializer {
    static space(space) {
        return {
            id: space.id,
            name: space.getName(),
            location: space.getLocation(),
            capacity: space.getCapacity(),
            description: space.getDescription(),
            active: space.isActive(),
            createdAt: space.createdAt,
            updatedAt: space.updatedAt,
        };
    }
    static booking(booking) {
        return {
            id: booking.id,
            spaceId: booking.getSpaceId(),
            clientEmail: booking.getClientEmail(),
            date: booking.getDate(),
            startTime: booking.getStartTime(),
            endTime: booking.getEndTime(),
            status: booking.getStatus(),
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
        };
    }
}
exports.EntitySerializer = EntitySerializer;
