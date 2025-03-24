import { ReactNode, useState } from "react";
import Button from "./Button";
import { ClassValue } from "clsx";
import clsx from "clsx";
import useClickOut from "src/shared/hooks/useClickOut";

function getLabel(option: string, labels: undefined | Record<string, string>) {
    return labels?.[option] ?? option;
}

interface Props {
    value: string;
    options: Array<string>;
    labels?: Record<string, string>;
    onOption: (option: string) => void;
    icon?: ReactNode;
    className?: ClassValue;
}


export default function Dropdown({ value, options, labels, onOption, icon, className }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const { handleMouseEnter, handleMouseLeave } = useClickOut(() => setIsOpen(false));

    const selectOption = (option: string) => {
        setIsOpen(false);
        onOption(option);
    }

    const selectedOptLabel = getLabel(value, labels);

    return (
        <div
            className="relative group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Button
                className={clsx(className,
                    { "bg-neutral-800 text-blue-300 shadow border-gray-700": isOpen }
                )}
                icon={icon}
                children={selectedOptLabel}
                onClick={() => {
                    setIsOpen(prev => !prev);

                    // cancelar seleccion de texto
                    window.getSelection()?.removeAllRanges();
                }}
            />

            <div className={clsx("w-min-full absolute left-1/2 transform -translate-x-1/2 bg-bg-primary mt-1 border-2 border-gray-700 rounded-lg shadow-lg",
                { "invisible": !isOpen }
            )}>
                {options.map(option => {
                    const label = getLabel(option, labels);

                    return (<Button
                        className="w-full text-left text-sm border-none rounded-none select-none"
                        children={label}
                        onClick={() => selectOption(option)}
                    />)
                })}
            </div>

        </div>
    );
}