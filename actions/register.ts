"use server"

import * as z from "zod"
import { signupSchema } from "@/lib/schemas"
import bcrypt from 'bcrypt';
import prisma from "@/lib/db";
import { getUserByEmail } from "@/data/user";

export const register = async (values:z.infer<typeof signupSchema>) => {
    const validatedFields = signupSchema.safeParse(values);
    if (!validatedFields.success) {
        return {error: "Invalid fields"};
    }
    const {username, email, password} = validatedFields.data;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        return {error: "User already exists"};
    }

    const hash = await bcrypt.hash(password, 10);
    await prisma.user.create({
        data: {
            name: username,
            email,
            password: hash
        }
    });

    // todo send verification token email ?
    return {success: "Signed up"};
}