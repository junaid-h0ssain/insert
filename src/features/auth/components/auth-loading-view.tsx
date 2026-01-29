import { Spinner } from "@/components/ui/spinner";

export function AuthLoadingView() {
    return (
        <div className="flex items-center justify-center h-screen">
            <Spinner className="w-10 h-10 text-primary" />
        </div>
    );
}