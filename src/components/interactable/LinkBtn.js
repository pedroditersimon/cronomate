import { jsx as _jsx } from "react/jsx-runtime";
import { Link } from "react-router-dom";
export default function LinkBtn({ children, to, target, onClick, className }) {
    return (_jsx(Link, { className: `flex flex-row gap-1 self-center rounded-lg p-0.5 px-2 hover:cursor-pointer hover:bg-gray-700 ${className}`, onClick: onClick, to: to, target: target, children: children }));
}
