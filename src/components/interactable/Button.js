import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from "clsx";
import { ForbiddenIcon } from "src/assets/Icons";
export default function Button({ icon, onClick, disabled, className, children }) {
    return (_jsx("button", { className: clsx("flex flex-row gap-1 py-1 px-2 rounded-lg text-center border-2 border-gray-700", "bg-transparent font-semibold text-gray-500", "transition-colors hover:bg-gray-700 hover:text-blue-300 hover:shadow", // hover
        className), disabled: disabled, onClick: onClick, children: _jsxs("div", { className: "flex-grow flex flex-row gap-1 justify-center items-center", children: [disabled
                    ? _jsx(ForbiddenIcon, { className: "size-5" })
                    : icon, children] }) }));
}
