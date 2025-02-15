import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CrossIcon } from "src/assets/Icons";
import clsx from "clsx";
import Container from "src/layouts/Container";
import ContainerTopbar from "src/layouts/ContainerTopbar";
import useClickOut from "src/hooks/useClickOut";
export function showModal(id, show = true) {
    const dialog = document.getElementById(id);
    if (dialog instanceof HTMLDialogElement) {
        if (show)
            dialog.showModal();
        else
            dialog.close();
    }
}
export function Modal({ id, title, closeOnClickOut, hideCloseBtn, className, children }) {
    const { handleMouseEnter, handleMouseLeave } = useClickOut(() => showModal(id, false), closeOnClickOut);
    return (_jsx("dialog", { id: id, className: "bg-transparent backdrop:bg-black backdrop:bg-opacity-75", children: _jsxs(Container, { className: clsx("max-w-full max-h-full size-fit", className), onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, children: [_jsx(ContainerTopbar, { className: "group", title: title, icon: !hideCloseBtn && _jsx(CrossIcon, {}), onIconClick: () => showModal(id, false) }), children] }) }));
}
