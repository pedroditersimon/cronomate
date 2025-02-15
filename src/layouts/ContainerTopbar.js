import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from "clsx";
import Clickable from "src/components/interactable/Clickable";
export default function ContainerTopbar({ left, title, middle, right, icon, onIconClick, iconOnHover, className }) {
    return (_jsxs("div", { className: clsx("flex flex-row pb-1 justify-between", className), children: [_jsxs("div", { className: "justify-start flex flex-row gap-1", children: [left, title &&
                        _jsx("h1", { className: "text-xl font-bold text-neutral-200", children: title })] }), _jsx("div", { children: middle }), _jsxs("div", { className: "flex flex-row gap-1", children: [right, icon &&
                        _jsx(Clickable, { className: clsx("p-0 text-neutral-200 hover:bg-gray-700", {
                                "hidden group-hover:block": iconOnHover
                            }), children: icon, onClick: onIconClick })] })] }));
}
