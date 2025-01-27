import clsx, { ClassValue } from "clsx";
import { MouseEventHandler, PropsWithChildren, ReactNode } from "react";

interface Props extends PropsWithChildren {
    icon?: ReactNode;
    onClick: MouseEventHandler<HTMLButtonElement>;
    className?: ClassValue;
}

export default function Button({ icon, onClick, className, children }: Props) {
    return (
        <button
            className={clsx("flex flex-row gap-1 py-1 px-2 rounded-lg text-center border-2 border-gray-700",
                "bg-transparent font-semibold text-gray-500",  // not hover
                "transition-colors hover:bg-gray-700 hover:text-blue-300 hover:shadow",     // hover
                className,
            )}

            onClick={onClick}
        >
            {icon}
            <div className="flex-grow">
                {children}
            </div>
        </button>
    );
}