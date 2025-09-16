import { FastifyInstance } from "fastify";
import { SpacesController } from "./SpacesController";
import { BookingsController } from "./BookingsController";
export declare function setupRoutes(fastify: FastifyInstance, spacesController: SpacesController, bookingsController: BookingsController): void;
