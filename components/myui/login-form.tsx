'use client'
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormLabel, FormItem, FormField, FormMessage } from "@/components/ui/form"
import { set, useForm } from "react-hook-form"
import { loginSchema } from "@/lib/schemas"
import { z } from "zod"
import { FormError } from "./form-error"
import { FormSuccess } from "./form-success"
import { login } from "@/actions/login"
import { useState, useTransition } from "react"
import { redirect } from "next/navigation"
export function LoginForm() {
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    const onSubmit = (data: z.infer<typeof loginSchema>) => {
        startTransition(() => {
            login(data).then((result) => {
                setError(result?.error ? result?.error : "")
                setSuccess(result?.success ? result.success : "")
            });
        });
    }
    return (
        <div className="dark">
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <FormField
                                    name="email"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="email">Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    placeholder="email@example.com"
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                            </div>
                            <div className="grid gap-2">
                                <FormField
                                    name="password"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center">
                                                <FormLabel htmlFor="password">Password</FormLabel>
                                                <Link href="#" className="ml-auto inline-block text-sm underline">
                                                    Forgot your password?
                                                </Link>
                                            </div>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="password"
                                                    placeholder="******"
                                                    disabled={isPending}
                                                    required
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                            </div>
                            <FormError message={error} />
                            <FormSuccess message={success} />
                            <Button type="submit" className="w-full" disabled={isPending}>
                                Login
                            </Button>
                            <Button variant="outline" className="w-full" disabled={isPending}>
                                Login with Google
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="underline">
                                Sign up
                            </Link>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
        </div>
    )
}
