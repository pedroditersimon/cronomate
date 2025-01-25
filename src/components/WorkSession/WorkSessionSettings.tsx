import { useMemo, useState } from "react";
import { ChevronVerticalIcon, CrossIcon } from "../../assets/Icons";
import ContainerTopbar from "../../layouts/ContainerTopbar";
import { RecordType, WorkSessionSettingsType, WorkSessionType } from "../../types/Activity";
import FormField from "../forms/FormField";
import ToggleTabs from "../interactable/ToggleTabs";
import { TimeInput } from "../interactable/TimeInput";
import HSeparator from "../../layouts/HSeparator";
import Clickable from "../interactable/Clickable";
import Activity from "../Activity/Activity";
import useWorkSessionSettigs from "../../hooks/useWorkSessionSettigs";
import { TimeInputMinutes } from "../interactable/TimeInputMinutes";
import Button from "../interactable/Button";


interface Props {
    session: WorkSessionType;
    onSessionChange: (newSession: WorkSessionType) => void;

    onClose: () => void;
}


export default function WorkSessionSettings({ session, onSessionChange, onClose }: Props) {
    const { workSessionSettings, setSettings, save } = useWorkSessionSettigs();
    const [expandDeletedActivities, setExpandDeletedActivities] = useState(false);

    const [deletedActivities] = useMemo(() => {
        const deletedActivities = session.activities.filter(act => act.deleted);
        return [deletedActivities];
    }, [session]);

    const handleChangeTimer = (newTimer: RecordType) => {
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
                <FormField title="Inicio y fin">
                    <div className="flex flex-row gap-2">
                        <TimeInput
                            className="max-w-full"
                            time={session.timer.startTime}
                            onTimeChange={newStartTime => handleChangeTimer({
                                ...session.timer,
                                startTime: newStartTime
                            })}
                        />
                        -
                        <TimeInput
                            className="max-w-full"
                            time={session.timer.endTime}
                            onTimeChange={newEndTime => handleChangeTimer({
                                ...session.timer,
                                endTime: newEndTime
                            })} />
                    </div>
                </FormField>

                <FormField title="Limite de duración">
                    <TimeInputMinutes
                        className="max-w-full"
                        minutes={session.maxDurationMinutes}
                        onMinutesChange={minutes => onSessionChange({
                            ...session,
                            maxDurationMinutes: minutes
                        })}
                    />
                </FormField>
            </div>

            <FormField title="Detener temporizador al finalizar la jornada">
                <ToggleTabs falseLabel="Desactivado" trueLabel="Al finalizar"
                    value={workSessionSettings.stopOnSessionEnd}
                    onSelected={(value) => handleSetSettings({
                        ...workSessionSettings,
                        stopOnSessionEnd: value
                    })}
                />
                {workSessionSettings.stopOnSessionEnd && <p className="text-gray-500 text-sm">El temporizador se detendrá automáticamente al finalizar la jornada.</p>}
            </FormField>

            <FormField title="Detener temporizador al cerrar la pagina">
                <ToggleTabs falseLabel="Desactivado" trueLabel="Al cerrar página"
                    value={workSessionSettings.stopOnClose}
                    onSelected={(value) => handleSetSettings({
                        ...workSessionSettings,
                        stopOnClose: value
                    })}
                />
                {workSessionSettings.stopOnClose && <p className="text-gray-500 text-sm">El temporizador se detendrá automáticamente al cerrar la página.</p>}
            </FormField>


            <FormField title="Visualizar actividades en forma de tabla">
                <Button onClick={() => { }}>
                    Generar tabla
                </Button>
            </FormField>


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
        </>
    );
}