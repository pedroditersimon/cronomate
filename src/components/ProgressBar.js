import { jsx as _jsx } from "react/jsx-runtime";
import clsx from "clsx";
export function ProgressBar({ progress, background, backgroundOnExcess = "bg-red-400", foreground }) {
    const percentage = progress > 100 ? (100 / progress) * 100 : Math.max(0, progress);
    return (_jsx("div", { className: clsx("w-full h-1 rounded-full bg-gray-200", background, progress > 100 && backgroundOnExcess), children: _jsx("div", { className: clsx("h-full rounded-full bg-blue-400", foreground), style: { width: `${percentage}% ` } }) }));
}
