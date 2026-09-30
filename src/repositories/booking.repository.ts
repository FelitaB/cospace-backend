import { Prisma, type Booking } from "../generated/prisma/client";
import { prisma } from "../utils/db";

export type { Booking };
export type CreateBookingData = Prisma.BookingUncheckedCreateInput;
export type UpdateBookingData = Prisma.BookingUncheckedUpdateInput;

// Prisma throws P2025 when an update/delete targets a row that does not exist.
const isRecordNotFound = (error: unknown): boolean =>
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";

export class BookingRepository {
    findAll(): Promise<Booking[]> {
        return prisma.booking.findMany({ orderBy: { id: "asc" } });
    }

    findPaginated(skip: number, limit: number): Promise<Booking[]> {
        return prisma.booking.findMany({
            skip,
            take: limit,
            orderBy: { id: "asc" },
        });
    }

    count(): Promise<number> {
        return prisma.booking.count();
    }

    findById(id: number): Promise<Booking | null> {
        return prisma.booking.findUnique({ where: { id } });
    }

    create(data: CreateBookingData): Promise<Booking> {
        return prisma.booking.create({ data });
    }

    async update(id: number, data: UpdateBookingData): Promise<Booking | null> {
        try {
            return await prisma.booking.update({ where: { id }, data });
        } catch (error) {
            if (isRecordNotFound(error)) {
                return null;
            }

            throw error;
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            await prisma.booking.delete({ where: { id } });
            return true;
        } catch (error) {
            if (isRecordNotFound(error)) {
                return false;
            }

            throw error;
        }
    }
}
