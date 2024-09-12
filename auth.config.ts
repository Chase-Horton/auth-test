import type { NextAuthConfig } from "next-auth";
import credentials from "next-auth/providers/credentials";
import { loginSchema } from "./lib/schemas";
import { getUserByEmail } from "./data/user";
import bcrypt from 'bcryptjs';
export default {
    providers: [credentials({
        async authorize(credentials) {
            const validatedFields = loginSchema.safeParse(credentials);
            if (!validatedFields.success) {
                return null;
            }
            const { email, password } = validatedFields.data;

            const user = await getUserByEmail(email);
            if (!user || !user.password) return null;

            const passwordValid = await bcrypt.compare(password, user.password);
            if (!passwordValid) return null;

            return user;
        }
    })],
} satisfies NextAuthConfig;