import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import './App.css';
import "./scrollbar.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TodaySessionPage } from './pages/TodaySession';
import { NotFoundPage } from './pages/NotFound';
import { HistoryPage } from './pages/History';
import StyledToaster from './components/StyledToaster';
function App() {
    return (_jsxs(_Fragment, { children: [_jsx(StyledToaster, {}), _jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: '/', element: _jsx(TodaySessionPage, {}) }), _jsx(Route, { path: '/history', element: _jsx(HistoryPage, {}) }), _jsx(Route, { path: '/history/:id', element: _jsx(HistoryPage, {}) }), _jsx(Route, { path: '*', element: _jsx(NotFoundPage, {}) })] }) })] }));
}
export default App;
