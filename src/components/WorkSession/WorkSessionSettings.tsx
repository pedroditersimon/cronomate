import { useMemo, useState } from "react";
import { ChevronVerticalIcon, CrossIcon } from "src/assets/Icons";
import ContainerTopbar from "src/layouts/ContainerTopbar";
import type { WorkSessionSettingsType, WorkSessionTimerType, WorkSessionType } from "src/types/Activity";
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


interface Props {
    session: WorkSessionType;
    onSessionChange: (newSession: WorkSessionType) => void;

    onClose: () => void;

    readOnly?: boolean;
}


export default function WorkSessionSettings({ session, onSessionChange, onClose, readOnly }: Props) {
    const { workSessionSettings, setSettings, save } = useWorkSessionSettigs();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setExpandDeletedActivities] = useState(false);

    const sessionHasActivities = session.activities.length > 0;

    const [deletedActivities, sessionTimerDuration] = useMemo(() => {
        const sessionTimerDuration = workSessionService.getTimerDurationInMinutes(session.timer);
        const deletedActivities = session.activities.filter(act => act.isDeleted);
        return [deletedActivities, sessionTimerDuration];
    }, [session]);

    const handleChangeTimer = (newTimer: WorkSessionTimerType) => {
        onSessionChange({
            ...session,
            timer: newTimer
        });
    }

    const handleSetSettings = (newSettings: WorkSessionSettingsType) => {
        setSettings(newSettings);
        save(); // save on edit
    }

    return (
        <>
            {/* Topbar */}
            <ContainerTopbar
                className="group"
                title="Ajustes de jornada"

                icon={<CrossIcon />}
                onIconClick={onClose}
            />


            <div className="flex flex-row gap-5">
                <FormField title="Inicio" className="text-center">
                    <TimeInput
                        className="max-w-full"
                        time={session.timer.startTimeOverride || (session.timer.startTime ? session.timer.startTime + 1 : undefined)}
                        // si es undefined tambien el override lo es
                        onTimeChange={newStartTime => handleChangeTimer({
                            ...session.timer,
                            startTimeOverride: newStartTime
                        })}
                        readOnly={readOnly}
                    />
                </FormField>

                <FormField title="Fin" className="text-center">
                    <TimeInput
                        className={clsx("max-w-full",
                            { "text-red-400": session.timer.running && !session.timer.endTimeOverride }
                        )}
                        time={session.timer.endTimeOverride || session.timer.endTime}
                        onTimeChange={newEndTime => handleChangeTimer({
                            ...session.timer,
                            endTimeOverride: newEndTime
                        })}
                        readOnly={readOnly}
                    />
                </FormField>

                <FormField title="Duración" className="text-center">
                    <TimeInputMinutes
                        className="max-w-full"
                        minutes={sessionTimerDuration}
                        readOnly
                    />
                </FormField>
            </div>


            <FormField title="Tabla de actividades">
                <Button
                    onClick={() => showModal("table")}
                    disabled={!sessionHasActivities}
                >
                    Generar tabla
                </Button>
            </FormField>

            <WorkSessionTableModal id="table" session={session} />


            {/* Actividades eliminadas */}
            <div className="flex flex-col gap-1">
                <div className="flex gap-1 justify-between">
                    <p className="text-gray-400 font-semibold">Actividades eliminadas</p>
                    <Clickable className="p-0 hover:bg-gray-700"
                        children={<ChevronVerticalIcon />}
                        onClick={() => setExpandDeletedActivities(prev => !prev)}
                    />
                </div>
                <HSeparator className="mb-2" />

                <div className="flex flex-col gap-5">
                    {deletedActivities.length === 0
                        ? <p className="text-gray-500 text-sm">No hay actividades eliminadas.</p>
                        : deletedActivities.map(activity => (
                            <Activity
                                key={activity.id}
                                activity={activity}
                                onActivityChange={() => { }}
                                readOnly
                            />
                        ))
                    }
                </div>
            </div>


            <FormField title="Detener temporizador al finalizar la jornada" show={!readOnly}>
                <ToggleTabs falseLabel="Desactivado" trueLabel="Al finalizar"
                    value={workSessionSettings.stopOnSessionEnd}
                    onSelected={(value) => handleSetSettings({
                        ...workSessionSettings,
                        stopOnSessionEnd: value
                    })}
                />
                {workSessionSettings.stopOnSessionEnd && <p className="text-gray-500 text-sm">El temporizador se detendrá automáticamente al finalizar la jornada.</p>}
            </FormField>


            <FormField title="Detener temporizador al cerrar la pagina" show={!readOnly}>
                <ToggleTabs falseLabel="Desactivado" trueLabel="Al cerrar página"
                    value={workSessionSettings.stopOnClose}
                    onSelected={(value) => handleSetSettings({
                        ...workSessionSettings,
                        stopOnClose: value
                    })}
                />
                {workSessionSettings.stopOnClose && <p className="text-gray-500 text-sm">El temporizador se detendrá automáticamente al cerrar la página.</p>}
            </FormField>

        </>
    );
}