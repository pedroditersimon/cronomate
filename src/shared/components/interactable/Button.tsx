import clsx, { ClassValue } from "clsx";
import { MouseEventHandler, PropsWithChildren, ReactNode } from "react";
import { ForbiddenIcon } from "src/assets/Icons";
import { ButtonVariant } from "src/shared/types/ButtonVariant";

interface Props extends PropsWithChildren {
    icon?: ReactNode;
    onClick: MouseEventHandler<HTMLButtonElement>;
    textOnly?: boolean;

    disabled?: boolean;
    variant?: ButtonVariant;
    className?: ClassValue;
}

export default function Button({ icon, onClick, disabled, textOnly, variant = ButtonVariant.Secondary, className, children }: Props) {

    const isTextOnly = textOnly || disabled;

    return (
        <button
            className={clsx("flex min-w-0 max-w-full flex-row gap-1 py-1 px-2 rounded-lg text-center font-semibold text-gray-500",
                "transition-colors bg-transparent border-2",
                { "border-transparent": isTextOnly },
                { "border-gray-700": !isTextOnly },
                { "hover:bg-gray-700 hover:text-blue-300 hover:shadow": !disabled && variant === ButtonVariant.Secondary }, // <- hover
                { "hover:bg-red-500 hover:text-red-100 hover:shadow hover:border-transparent": !disabled && variant === ButtonVariant.Danger },
                { "opacity-50 hover:text-blue-300": disabled },
                className,
            )}
            disabled={disabled}
            onClick={onClick}
        >
            <div className="flex min-w-0 flex-wrap items-center flex-grow gap-0.5 justify-center select-none">
                {disabled
                    ? <ForbiddenIcon className="size-5" />
                    : icon
                }

                {children}
            </div>
        </button>
    );
}
