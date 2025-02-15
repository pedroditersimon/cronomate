import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BriefcaseIcon, SettingsIcon, InboxStackIcon } from "src/assets/Icons";
import Sidebar from "./Sidebar";
export default function PageLayout({ children }) {
    return (_jsxs("div", { className: 'p-5 w-screen h-screen flex flex-row gap-5 items-center', children: [_jsx("div", { className: 'h-full w-60', children: _jsx(Sidebar, { links: [
                        {
                            to: "/#",
                            icon: _jsx(BriefcaseIcon, {}),
                            text: "Hoy",
                        },
                        {
                            to: "/history",
                            icon: _jsx(InboxStackIcon, {}),
                            text: "Historial",
                        },
                        {
                            to: "/1",
                            text: "Sin icono",
                        },
                        {
                            to: "/2",
                            icon: _jsx(BriefcaseIcon, {}),
                        },
                        {
                            to: "/settings",
                            icon: _jsx(SettingsIcon, {}),
                            text: "Ajustes",
                        },
                    ] }) }), _jsx("div", { className: "flex-grow flex flex-row h-full gap-5 items-center justify-center", children: children })] }));
}
