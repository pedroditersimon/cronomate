import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from "clsx";
export default function FormField({ title, show = true, className, children }) {
    return (_jsxs("div", { className: clsx("flex flex-col gap-1 mb-1 w-full", className, { "hidden": !show }), children: [_jsx("p", { className: "text-gray-400 font-semibold", children: title }), children] }));
}
