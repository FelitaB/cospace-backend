import { ConflictError, UnauthorizedError } from "../errors";
import { LoginInput, RegisterInput } from "../schemas/auth.schema";
import { UserRepository, isDuplicateEmail } from "../repositories/user.repository";
import type { User } from "../generated/prisma/client";
import { comparePassword, generateToken, hashPassword } from "../utils/auth";

// Compared against when the email is unknown so login takes the same time either way.
const DECOY_HASH = "$2b$12$VPhISqF.PfD9A9xvBWHg0uuRuOBfEEFw31MhKwCzWOGHqXH/F4cfK";

export type LoginResult = {
    token: string;
    user: User;
};

export class AuthService {
    constructor(private readonly userRepository: UserRepository) {}

    async register(input: RegisterInput): Promise<User> {
        const password = await hashPassword(input.password);

        try {
            return await this.userRepository.create({ ...input, password });
        } catch (error) {
            // The unique index is the real guard; a pre-check would still race.
            if (isDuplicateEmail(error)) {
                throw new ConflictError("Email already registered");
            }

            throw error;
        }
    }

    async login(input: LoginInput): Promise<LoginResult> {
        const user = await this.userRepository.findByEmailWithPassword(input.email);
        const matches = await comparePassword(input.password, user?.password ?? DECOY_HASH);

        if (!user || !matches) {
            throw new UnauthorizedError("Invalid email or password");
        }

        return { token: generateToken(user), user };
    }
}
