import { jsx as _jsx } from "react/jsx-runtime";
import clsx from "clsx";
export default function HSeparator({ className }) {
    return (_jsx("hr", { className: clsx("border border-solid rounded border-gray-700", className) }));
}
