import clsx, { ClassValue } from "clsx";
import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
    onClick: () => void;
    className?: ClassValue;
}

export default function Button({ onClick, className, children }: Props) {
    return (
        <div
            className={clsx("flex-1 rounded-lg text-center border-2 border-gray-700",
                "bg-transparent font-semibold text-gray-500",  // not hover
                "hover:bg-gray-700 hover:text-blue-300",     // hover
                className,
            )}
        >
            <button
                className="size-full py-1 px-2"
                onClick={onClick}
                children={children}
            />
        </div>

    );
}