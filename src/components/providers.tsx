"use client";

import { ClerkProvider, SignInButton, SignOutButton, SignUpButton, useAuth, UserButton } from "@clerk/nextjs";
import { Authenticated, AuthLoading, ConvexReactClient, Unauthenticated } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { dark } from "@clerk/themes";
import { ThemeProvider } from "./theme-provider";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider appearance={{ theme: dark }}>
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <Authenticated>
                        <UserButton/>
                        {children}
                        <SignOutButton/>
                    </Authenticated>
                    <Unauthenticated>
                        <SignInButton/><br />
                        <SignUpButton/>
                    </Unauthenticated>
                    <AuthLoading>
                        Loading...
                    </AuthLoading>
                    
                </ThemeProvider>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
}

