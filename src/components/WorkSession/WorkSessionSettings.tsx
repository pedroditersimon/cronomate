import { useMemo, useState } from "react";
import { ChevronVerticalIcon, CrossIcon } from "../../assets/Icons";
import ContainerTopbar from "../../layouts/ContainerTopbar";
import { WorkSessionType } from "../../types/Activity";
import FormField from "../forms/FormField";
import ToggleTabs from "../Interactable/ToggleTabs";
import { TimeInput } from "../Interactable/TimeInput";
import HSeparator from "../../layouts/HSeparator";
import Clickable from "../Interactable/Clickable";
import Activity from "../Activity/Activity";

interface Props {
    session: WorkSessionType;
    onClose: () => void;
}

export default function WorkSessionSettings({ session, onClose }: Props) {
    const [autoStop, setAutoStop] = useState(false);
    const [expandDeletedActivities, setExpandDeletedActivities] = useState(false);

    const deletedActivities = useMemo(() => {
        return session.activities.filter(act => act.deleted);
    }, [session]);

    return (
        <>
            {/* Topbar */}
            <ContainerTopbar
                className="group"
                title="Ajustes de jornada"

                icon={<CrossIcon />}
                onIconClick={onClose}
            />

            <FormField title="Inicio y Fin">
                <div className="flex flex-row gap-2">
                    <TimeInput></TimeInput>
                    -
                    <TimeInput></TimeInput>
                </div>
            </FormField>

            <FormField title="Detener temporizador">
                <ToggleTabs falseLabel="Manualmente" trueLabel="Automático" onSelected={setAutoStop} />
                {autoStop && <p className="text-gray-500 text-sm">Detiene el temporizador automaticamente al finalizar la jornada.</p>}
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