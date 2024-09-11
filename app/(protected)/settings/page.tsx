import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button"

export default async function SettingsPage() {
    const session = await auth();
    return (
        <div>
            <h1>Settings</h1>
            <p>{JSON.stringify(session)}</p>
            <form action={
                async () => {
                    'use server';
                    await signOut({
                        redirect: true,
                        redirectTo: "/login"
                    });
                }
            }>
                <Button type="submit">Log Out</Button>
            </form>
        </div>
    )
}