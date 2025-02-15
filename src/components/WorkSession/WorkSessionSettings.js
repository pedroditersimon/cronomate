import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { ChevronVerticalIcon, CrossIcon } from "src/assets/Icons";
import ContainerTopbar from "src/layouts/ContainerTopbar";
import FormField from "../forms/FormField";
import ToggleTabs from "src/components/interactable/ToggleTabs";
import { TimeInput } from "src/components/interactable/TimeInput";
import HSeparator from "src/layouts/HSeparator";
import Clickable from "src/components/interactable/Clickable";
import Activity from "src/components/Activity/Activity";
import useWorkSessionSettigs from "src/hooks/useWorkSessionSettigs";
import { TimeInputMinutes } from "src/components/interactable/TimeInputMinutes";
import Button from "src/components/interactable/Button";
import { showModal } from "../Modal";
import WorkSessionTableModal from "./WorkSessionTableModal";
import clsx from "clsx";
import workSessionService from "src/services/workSessionService";
export default function WorkSessionSettings({ session, onSessionChange, onClose, readOnly }) {
    const { workSessionSettings, setSettings, save } = useWorkSessionSettigs();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setExpandDeletedActivities] = useState(false);
    const sessionHasActivities = session.activities.length > 0;
    const [deletedActivities, sessionTimerDuration] = useMemo(() => {
        const sessionTimerDuration = workSessionService.getTimerDurationInMinutes(session.timer);
        const deletedActivities = session.activities.filter(act => act.isDeleted);
        return [deletedActivities, sessionTimerDuration];
    }, [session]);
    const handleChangeTimer = (newTimer) => {
        onSessionChange(Object.assign(Object.assign({}, session), { timer: newTimer }));
    };
    const handleSetSettings = (newSettings) => {
        setSettings(newSettings);
        save(); // save on edit
    };
    return (_jsxs(_Fragment, { children: [_jsx(ContainerTopbar, { className: "group", title: "Ajustes de jornada", icon: _jsx(CrossIcon, {}), onIconClick: onClose }), _jsxs("div", { className: "flex flex-row gap-5", children: [_jsx(FormField, { title: "Inicio", className: "text-center", children: _jsx(TimeInput, { className: "max-w-full", time: session.timer.startTimeOverride || (session.timer.startTime ? session.timer.startTime + 1 : undefined), 
                            // si es undefined tambien el override lo es
                            onTimeChange: newStartTime => handleChangeTimer(Object.assign(Object.assign({}, session.timer), { startTimeOverride: newStartTime })), readOnly: readOnly }) }), _jsx(FormField, { title: "Fin", className: "text-center", children: _jsx(TimeInput, { className: clsx("max-w-full", { "text-red-400": session.timer.running && !session.timer.endTimeOverride }), time: session.timer.endTimeOverride || session.timer.endTime, onTimeChange: newEndTime => handleChangeTimer(Object.assign(Object.assign({}, session.timer), { endTimeOverride: newEndTime })), readOnly: readOnly }) }), _jsx(FormField, { title: "Duraci\u00F3n", className: "text-center", children: _jsx(TimeInputMinutes, { className: "max-w-full", minutes: sessionTimerDuration, readOnly: true }) })] }), _jsx(FormField, { title: "Tabla de actividades", children: _jsx(Button, { onClick: () => showModal("table"), disabled: !sessionHasActivities, children: "Generar tabla" }) }), _jsx(WorkSessionTableModal, { id: "table", session: session }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsxs("div", { className: "flex gap-1 justify-between", children: [_jsx("p", { className: "text-gray-400 font-semibold", children: "Actividades eliminadas" }), _jsx(Clickable, { className: "p-0 hover:bg-gray-700", children: _jsx(ChevronVerticalIcon, {}), onClick: () => setExpandDeletedActivities(prev => !prev) })] }), _jsx(HSeparator, { className: "mb-2" }), _jsx("div", { className: "flex flex-col gap-5", children: deletedActivities.length === 0
                            ? _jsx("p", { className: "text-gray-500 text-sm", children: "No hay actividades eliminadas." })
                            : deletedActivities.map(activity => (_jsx(Activity, { activity: activity, onActivityChange: () => { }, readOnly: true }, activity.id))) })] }), _jsxs(FormField, { title: "Detener temporizador al finalizar la jornada", show: !readOnly, children: [_jsx(ToggleTabs, { falseLabel: "Desactivado", trueLabel: "Al finalizar", value: workSessionSettings.stopOnSessionEnd, onSelected: (value) => handleSetSettings(Object.assign(Object.assign({}, workSessionSettings), { stopOnSessionEnd: value })) }), workSessionSettings.stopOnSessionEnd && _jsx("p", { className: "text-gray-500 text-sm", children: "El temporizador se detendr\u00E1 autom\u00E1ticamente al finalizar la jornada." })] }), _jsxs(FormField, { title: "Detener temporizador al cerrar la pagina", show: !readOnly, children: [_jsx(ToggleTabs, { falseLabel: "Desactivado", trueLabel: "Al cerrar p\u00E1gina", value: workSessionSettings.stopOnClose, onSelected: (value) => handleSetSettings(Object.assign(Object.assign({}, workSessionSettings), { stopOnClose: value })) }), workSessionSettings.stopOnClose && _jsx("p", { className: "text-gray-500 text-sm", children: "El temporizador se detendr\u00E1 autom\u00E1ticamente al cerrar la p\u00E1gina." })] })] }));
}
