import clsx, { ClassValue } from "clsx";
import { PropsWithChildren, ReactNode } from "react";

interface Props extends PropsWithChildren {
    icon?: ReactNode;
    onClick: () => void;
    className?: ClassValue;
}

export default function Button({ icon, onClick, className, children }: Props) {
    return (
        <div
            className={clsx("flex-1 rounded-lg text-center border-2 border-gray-700",
                "bg-transparent font-semibold text-gray-500",  // not hover
                "transition-colors hover:bg-gray-700 hover:text-blue-300 hover:shadow",     // hover
                className,
            )}
        >
            <button
                className="flex flex-row gap-1 size-full py-1 px-2"
                onClick={onClick}
            >
                {icon}
                <div className="flex-grow">
                    {children}
                </div>
            </button>

        </div>

    );
}