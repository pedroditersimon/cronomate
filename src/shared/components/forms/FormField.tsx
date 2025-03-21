import clsx from "clsx";
import { ClassValue } from "clsx";
import { PropsWithChildren } from "react";


interface Props extends PropsWithChildren {
    title: string;
    show?: boolean;
    className?: ClassValue;

    hint?: {
        text: string;
        show: boolean;
        className?: ClassValue;
    };
}


export default function FormField({ title, show = true, className, hint, children }: Props) {

    return (
        <div className={clsx("flex flex-col gap-1 mb-1 w-full", className,
            { "hidden": !show }
        )}>

            {/* Title */}
            <p className="text-gray-400 font-semibold">{title}</p>

            {/* Content */}
            {children}

            {/* Hint text */}
            {hint?.show && (
                <p className={clsx("text-gray-500 text-sm", hint.className)}>
                    {hint.text}
                </p>
            )}
        </div>
    );
}