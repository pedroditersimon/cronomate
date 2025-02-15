var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx } from "react/jsx-runtime";
export default function Container(_a) {
    var { children } = _a, props = __rest(_a, ["children"]);
    return (_jsx("div", Object.assign({}, props, { className: `relative max-w-full h-full p-1 shadow-lg border-2 rounded-lg border-gray-700 transition duration-200 border-opacity-50 hover:border-opacity-100 bg-[#161616] ${props.className}`, children: _jsx("div", { className: "flex h-full flex-col gap-5 p-5 pr-4 overflow-y-scroll overflow-x-hidden", children: children }) })));
}
