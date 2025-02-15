import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import clsx from 'clsx';
export default function ToggleTabs({ value, falseLabel, trueLabel, onSelected }) {
    const [selected, setSelected] = useState(value ? trueLabel : falseLabel);
    const handleSetSelected = (option) => {
        const value = option === trueLabel;
        setSelected(option);
        if (onSelected)
            onSelected(value);
    };
    return (_jsxs("div", { className: "flex border-2 border-gray-700 rounded-md shadow", children: [_jsx("button", { className: clsx("flex-1 rounded-l py-1 px-2 text-center transition-colors", {
                    "bg-gray-700 text-blue-300 font-semibold": selected === falseLabel,
                    "text-gray-500 hover:text-neutral-300 hover:bg-neutral-800": selected !== falseLabel
                }), onClick: () => handleSetSelected(falseLabel), children: falseLabel }), _jsx("button", { className: clsx("flex-1 rounded-r py-1 px-2 text-center", {
                    "bg-gray-700 text-blue-300 font-semibold": selected === trueLabel,
                    "text-gray-500 hover:text-neutral-300 hover:bg-neutral-800": selected !== trueLabel
                }), onClick: () => handleSetSelected(trueLabel), children: trueLabel })] }));
}
