import { cn } from "src/shared/utils/cn";
import clsx from "clsx";
import { HTMLProps, ReactNode } from "react";

interface Props extends HTMLProps<HTMLDivElement> {
    children: ReactNode;
    scrollable?: boolean;
}

export default function Container({ children, scrollable = true, ...props }: Props) {
    return (
        <div
            {...props}
            className={clsx(
                "shadow-lg border-2 rounded-lg border-gray-700 transition duration-200 border-opacity-50 hover:border-opacity-100 bg-[#161616]",
                cn("relative flex h-full w-96 min-h-0 min-w-0 max-w-full shrink-0 flex-col p-1", props.className)
            )}
        >
            <div className={cn(
                "flex min-h-0 min-w-0 flex-1 flex-col gap-5 p-5 pr-4",
                scrollable ? "overflow-y-auto overflow-x-hidden" : "overflow-visible"
            )}>
                {children}
            </div>
        </div>
    );
}
