"use server"
import * as z from "zod"
import { loginSchema } from "@/lib/schemas"
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
export const login = async (values:z.infer<typeof loginSchema>) => {
    const validatedFields = loginSchema.safeParse(values);
    if (!validatedFields.success) {
        return {error: "Invalid fields"};
    }
    const {email, password} = validatedFields.data;


    try {
        await signIn("credentials", {
            email,
            password,
            redirect: true,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        });
        return {success: "Logged in"};
    } catch (error) {
        if (error instanceof AuthError) {
            if (error.type = "CredentialsSignin") {
                return {error: "Invalid credentials"};
            }
            return {error: "Something went wrong!"};
        }
        throw error;
    }
}