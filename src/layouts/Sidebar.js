import { jsx as _jsx } from "react/jsx-runtime";
import { createElement as _createElement } from "react";
import Container from "./Container";
import clsx from "clsx";
import LinkBtn from "src/components/interactable/LinkBtn";
export default function Sidebar({ links }) {
    const currentLocation = window.location.pathname;
    return (_jsx(Container, { className: "h-full", children: links.map(link => {
            const isSelected = currentLocation.startsWith(link.to);
            return (_createElement(LinkBtn, Object.assign({}, link, { key: link.to, className: clsx("w-full justify-center rounded-lg hover:bg-gray-700 hover:shadow", { "bg-gray-700 shadow": isSelected }) }),
                link.icon &&
                    _jsx("div", { className: clsx("size-6", { "m-auto": !link.text }), children: link.icon }),
                link.text && _jsx("span", { className: "mr-auto", children: link.text })));
        }) }));
}
