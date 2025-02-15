import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from "clsx";
import { useEffect, useState } from "react";
// Se utiliza con el hook useIndicator
export default function Indicator({ indicatorState, delay, text, icon, className }) {
    const [show, setShow] = useState(false);
    useEffect(() => {
        setShow(true);
        const timeout = setTimeout(() => setShow(false), delay || 3500);
        return () => clearTimeout(timeout); // cleanup
    }, [delay, indicatorState]);
    return (_jsxs("div", { className: clsx("flex flex-row py-0.5 px-1 items-center bg-gray-700 bg-opacity-25 rounded-md", "opacity-100 transition-opacity ease-out duration-500", className, {
            "opacity-0": !show,
            "opacity-100": show
        }), children: [icon === null ? null : icon, _jsx("span", { className: "text-sm", children: text })] }));
}
