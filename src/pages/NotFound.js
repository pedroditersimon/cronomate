import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import LinkBtn from 'src/components/interactable/LinkBtn';
import Container from 'src/layouts/Container';
import PageLayout from 'src/layouts/PageLayout';
export function NotFound() {
    return (_jsxs(Container, { className: 'text-center', children: [_jsx("h1", { className: "text-6xl font-bold text-red-500 mb-4", children: "404" }), _jsx("h2", { className: "text-2xl font-semibold mb-2", children: "Page Not Found" }), _jsx("p", { className: "mb-6", children: "Sorry, the page you are looking for does not exist." }), _jsx(LinkBtn, { to: '/', children: "Go to Home" })] }));
}
;
export function NotFoundPage() {
    return (_jsx(PageLayout, { children: _jsx(NotFound, {}) }));
}
