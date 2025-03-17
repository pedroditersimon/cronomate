import clsx from "clsx";
import { ClassValue } from "clsx";
import { ReactNode } from "react";
import Clickable from "src/shared/components/interactable/Clickable";

// <- [left]  |  [title]  |  [middle]  |  [right] ->
interface Props {
    left?: ReactNode;       // *ooo
    title?: ReactNode;      // o*oo
    middle?: ReactNode;     // oo*o
    right?: ReactNode;      // ooo*

    iconOnHover?: boolean;
    icon?: ReactNode;
    onIconClick?: () => void;

    className?: ClassValue;
}

export default function ContainerTopbar({ left, title, middle, right, icon, onIconClick, iconOnHover, className }: Props) {
    return (
        <div className={clsx("flex flex-row pb-1 justify-between", className)}>
            <div className="justify-start flex flex-row gap-1">
                {left}
                {title &&
                    <h1 className="text-xl font-bold text-neutral-200">{title}</h1>
                }
            </div>

            <div >
                {middle}
            </div>

            <div className="flex flex-row gap-1">
                {right}
                {icon &&
                    <Clickable className={clsx("p-0 text-neutral-200 hover:bg-gray-700", {
                        "hidden group-hover:block": iconOnHover
                    })}
                        children={icon}
                        onClick={onIconClick}
                    />
                }
            </div>
        </div>
    );
}