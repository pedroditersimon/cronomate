import clsx, { ClassValue } from "clsx";
import { HTMLProps, ReactNode } from "react";

interface Props extends Omit<HTMLProps<HTMLDivElement>, "width"> {
    width?: ClassValue;
    children: ReactNode;
}

export default function Container({ width, children, ...props }: Props) {
    return (
        <div
            {...props}
            className={clsx(
                `relative w-fit size-full p-1 shadow-lg border-2 rounded-lg border-gray-700 transition duration-200 border-opacity-50 hover:border-opacity-100 bg-[#161616]`,
                props.className,
                `${width ?? "min-w-96"}`
            )}
        >
            <div className={clsx(
                "flex h-full flex-col gap-5 p-5 pr-4 overflow-y-scroll overflow-x-hidden",
                `${width ?? "min-w-96"}`
            )}>
                {children}
            </div>
        </div>
    );
}