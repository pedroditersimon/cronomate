import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import Container from 'src/layouts/Container';
import { useEffect, useState } from 'react';
import ContainerTopbar from 'src/layouts/ContainerTopbar';
import WorkSessionItem from 'src/components/WorkSession/WorkSessionItem';
import { WorkSession } from 'src/components/WorkSession/WorkSession';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from 'src/layouts/PageLayout';
import HSeparator from 'src/layouts/HSeparator';
import sessionStorageService from 'src/services/sessionStorageService';
export function History() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [history, setHistory] = useState([]);
    useEffect(() => {
        sessionStorageService.getItems("History")
            .then((results) => setHistory(results));
    }, []);
    const selectedSession = history.find(item => item.id === id);
    if (selectedSession) {
        return (_jsx(WorkSession, { session: selectedSession, onSessionChange: () => { }, readOnly: true }));
    }
    return (_jsxs(Container, { className: 'text-center min-w-80', children: [_jsx(ContainerTopbar, { title: 'Historial' }), _jsx("div", { className: 'flex flex-col gap-2', children: history.map(session => _jsxs(_Fragment, { children: [_jsx(WorkSessionItem, { session: session, onSelected: _selectedSession => navigate(`/history/${_selectedSession.id}`) }, session.id), _jsx(HSeparator, {})] })) })] }));
}
;
export function HistoryPage() {
    return (_jsx(PageLayout, { children: _jsx(History, {}) }));
}
