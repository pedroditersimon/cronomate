import clsx from "clsx";
import { ClassValue } from "clsx";
import { PropsWithChildren } from "react";


interface Props extends PropsWithChildren {
    title: string;
    className?: ClassValue;
}


export default function FormField({ title, children, className }: Props) {
    return (
        <div className={clsx("flex flex-col gap-1 mb-1 w-full", className)}>

            {/* Title */}
            <p className="text-gray-400 font-semibold">{title}</p>

            {/* Content */}
            {children}
        </div>
    );
}