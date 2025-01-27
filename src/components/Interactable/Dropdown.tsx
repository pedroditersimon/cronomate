import { ReactNode, useState } from "react";
import Button from "./Button";
import { ClassValue } from "clsx";
import clsx from "clsx";


interface Props {
    options: Array<string>;
    onOption: (option: string) => void;
    icon?: ReactNode;
    className?: ClassValue;
}


export default function Dropdown({ options, onOption, icon, className }: Props) {
    const [selectedOption, setSelectedOption] = useState(options[0]);
    const [isOpen, setIsOpen] = useState(false);

    const selectOption = (option: string) => {
        setIsOpen(false);
        setSelectedOption(option);
        onOption(option);
    }

    return (
        <div className="relative">
            <Button
                className={className}
                icon={icon}
                children={selectedOption}
                onClick={() => {
                    setIsOpen(prev => !prev);

                    // cancelar seleccion de texto
                    window.getSelection()?.removeAllRanges();
                }}
            />

            <div className={clsx("absolute left-1/2 transform -translate-x-1/2 mt-1 bg-bg-primary border-2 border-gray-700 rounded-lg shadow-lg",
                { "invisible": !isOpen }
            )}>
                {options.map(option =>
                    <Button
                        className="w-full text-left text-sm border-none rounded-none select-none"
                        children={option}
                        onClick={() => selectOption(option)}
                    />
                )}
            </div>

        </div>
    );
}