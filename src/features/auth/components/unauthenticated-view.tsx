import { ShieldAlertIcon } from "lucide-react"

import {
    Item,
    ItemContent,
    ItemDescription,
    ItemTitle,
    ItemMedia,
    ItemActions
} from "@/components/ui/item"
import { SignInButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"


export function UnauthenticatedView() {
    return (
        <div className="flex items-center justify-center h-screen bg-background">
            <Item variant="outline" className="max-w-md border border-border bg-card shadow-sm">
                <ItemMedia variant="icon">
                    <ShieldAlertIcon className="w-8 h-8 text-destructive" />
                </ItemMedia>
                <ItemContent>
                    <ItemTitle className="text-lg font-semibold">
                        Access Denied
                    </ItemTitle>
                    <ItemDescription className="text-sm text-muted-foreground">
                        You must be logged in to access this content.
                    </ItemDescription>
                </ItemContent>
                <ItemActions>
                    <SignInButton>
                        <Button variant="default">Sign In</Button>
                    </SignInButton>
                </ItemActions>
            </Item>
        </div>
    )
}