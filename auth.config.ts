import github from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";

export default {
    providers: [github]
} satisfies NextAuthConfig;