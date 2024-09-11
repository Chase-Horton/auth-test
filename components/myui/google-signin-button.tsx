import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

interface SignInButtonProps {
    isPending: boolean;
    message: string;
    provider: string;
    startTransition: Function
}
export default function SignInButton(props: SignInButtonProps) {
    const onLogonClick = () => {
        props.startTransition(() => {
            signIn(props.provider, {
                callbackUrl: DEFAULT_LOGIN_REDIRECT,
            });
        });
    }
    return (<Button variant="outline" className="w-full" disabled={props.isPending} onClick={onLogonClick}>
    {props.message}
</Button>);
}