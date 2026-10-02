import { Prisma, type User } from "../generated/prisma/client";
import { prisma } from "../utils/db";

export type SafeUser = Omit<User, "password">;
export type CreateUserData = Prisma.UserUncheckedCreateInput;

// ID lookups omit the hash; login and registration return the full user row.
const safeSelect = {
    id: true,
    first_name: true,
    last_name: true,
    email: true,
    team_id: true,
} satisfies Prisma.UserSelect;

export const isDuplicateEmail = (error: unknown): boolean =>
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";

export class UserRepository {
    // Returns the full row including the hash; only the login flow should use it.
    findByEmailWithPassword(email: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { email } });
    }

    findById(id: number): Promise<SafeUser | null> {
        return prisma.user.findUnique({ where: { id }, select: safeSelect });
    }

    create(data: CreateUserData): Promise<User> {
        return prisma.user.create({ data });
    }
}
