import clsx from "clsx";
import { ClassValue } from "clsx";
import { ReactNode, useEffect, useState } from "react";

interface Props {
    indicatorState?: boolean;
    delay?: number;

    text: string;
    icon?: ReactNode | null;
    className?: ClassValue;
}

// Se utiliza con el hook useIndicator
export default function Indicator({ indicatorState, delay, text, icon, className }: Props) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);
        const timeout = setTimeout(() => setShow(false), delay || 3500);
        return () => clearTimeout(timeout); // cleanup
    }, [delay, indicatorState]);

    return (
        <div
            className={clsx("flex flex-row py-0.5 px-1 items-center bg-gray-700 bg-opacity-25 rounded-md",
                "opacity-100 transition-opacity ease-out duration-500", className,
                {
                    "opacity-0": !show,
                    "opacity-100": show
                })}
        >
            {icon === null ? null : icon}
            <span className="text-sm">{text}</span>
        </div>
    );
}