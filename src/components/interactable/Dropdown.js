import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Button from "./Button";
import clsx from "clsx";
import useClickOut from "src/hooks/useClickOut";
export default function Dropdown({ value, options, onOption, icon, className }) {
    const [isOpen, setIsOpen] = useState(false);
    const { handleMouseEnter, handleMouseLeave } = useClickOut(() => setIsOpen(false));
    const selectOption = (option) => {
        setIsOpen(false);
        onOption(option);
    };
    return (_jsxs("div", { className: "relative group", onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, children: [_jsx(Button, { className: clsx(className, { "bg-neutral-800 text-blue-300 shadow border-gray-700": isOpen }), icon: icon, children: value, onClick: () => {
                    var _a;
                    setIsOpen(prev => !prev);
                    // cancelar seleccion de texto
                    (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.removeAllRanges();
                } }), _jsx("div", { className: clsx("w-min-full absolute left-1/2 transform -translate-x-1/2 bg-bg-primary mt-1 border-2 border-gray-700 rounded-lg shadow-lg", { "invisible": !isOpen }), children: options.map(option => _jsx(Button, { className: "w-full text-left text-sm border-none rounded-none select-none", children: option, onClick: () => selectOption(option) })) })] }));
}
