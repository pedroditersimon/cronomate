import clsx from "clsx";
import { ClassValue } from "clsx";
import { PropsWithChildren } from "react";
import { QuestionIcon } from "src/assets/Icons";
import Tooltip, { TooltipPosition } from "src/shared/components/Tooltip";


interface Props extends PropsWithChildren {
    title: string;
    show?: boolean;
    className?: ClassValue;

    hint?: {
        text: string;
        show: boolean;
        className?: ClassValue;
    };

    tooltip?: {
        text: string;
        showOn?: "icon" | "content";
        position?: TooltipPosition;
    };
}


export default function FormField({ title, show = true, className, hint, tooltip, children }: Props) {

    return (
        <div className={clsx("flex flex-col gap-1 mb-1 w-full", className,
            { "hidden": !show }
        )}>

            {/* Title */}
            <div className="flex items-center justify-between">
                <p className="flex-1 text-gray-400 font-semibold">{title}</p>

                {tooltip && (tooltip.showOn ?? "icon") === "icon" && (
                    <Tooltip text={tooltip.text} position={tooltip.position || "left"} showDelayMs={150}>
                        <QuestionIcon className="size-6 text-gray-700 hover:text-gray-400" />
                    </Tooltip>
                )}
            </div>


            {/* Content */}
            {tooltip?.showOn === "content"
                ? (
                    <Tooltip text={tooltip.text} position={tooltip.position || "bottom-start"}>
                        {children}
                    </Tooltip>
                )
                : (children)
            }

            {/* Hint text */}
            {
                hint?.show && (
                    <p className={clsx("text-gray-500 text-sm", hint.className)}>
                        {hint.text}
                    </p>
                )
            }
        </div >
    );
}