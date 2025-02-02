import clsx, { ClassValue } from "clsx";
import { MouseEventHandler, PropsWithChildren, ReactNode } from "react";
import { ForbiddenIcon } from "../../assets/Icons";

interface Props extends PropsWithChildren {
    icon?: ReactNode;
    onClick: MouseEventHandler<HTMLButtonElement>;

    disabled?: boolean;
    className?: ClassValue;
}

export default function Button({ icon, onClick, disabled, className, children }: Props) {
    return (
        <button
            className={clsx("flex flex-row gap-1 py-1 px-2 rounded-lg text-center border-2 border-gray-700",
                "bg-transparent font-semibold text-gray-500",
                "transition-colors hover:bg-gray-700 hover:text-blue-300 hover:shadow",     // hover
                className,
            )}
            disabled={disabled}
            onClick={onClick}
        >
            <div className="flex-grow flex flex-row gap-1 justify-center items-center">
                {disabled
                    ? <ForbiddenIcon className="size-5" />
                    : icon
                }

                {children}
            </div>
        </button>
    );
}