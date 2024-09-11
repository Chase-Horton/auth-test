import { auth } from "@/auth"

export default async function SettingsPage() {
    const session = await auth()
    return (
        <div>
            <h1>Settings</h1>
            <p>{JSON.stringify(session)}</p>
        </div>
    )
}