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
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormLabel, FormItem, FormField, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { signupSchema } from "@/lib/schemas"
import { z } from "zod"

export function SignUpForm() {
    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Enter your email below to sign up for an account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(() => {})}>
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
                                            <FormLabel htmlFor="password">Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="password"
                                                    placeholder="******"
                                                    required
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                            </div>
                            <div className="grid gap-2">
                                <FormField
                                    name="confirmPassword"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="password"
                                                    placeholder="******"
                                                    required
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                            </div>
                            <Button type="submit" className="w-full">
                                Sign Up
                            </Button>
                            <Button variant="outline" className="w-full">
                                Sign Up with Google
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Have an account?{" "}
                            <Link href="#" className="underline">
                                Login
                            </Link>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
