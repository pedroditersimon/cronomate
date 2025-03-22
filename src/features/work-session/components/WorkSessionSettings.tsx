import { ReactNode, useMemo, useState } from "react";
import { ChevronVerticalIcon, CrossIcon } from "src/shared/assets/Icons";
import ContainerTopbar from "src/shared/layouts/ContainerTopbar";
import FormField from "src/shared/components/forms/FormField";
import { TimeInput } from "src/shared/components/interactable/TimeInput";
import HSeparator from "src/shared/layouts/HSeparator";
import Clickable from "src/shared/components/interactable/Clickable";
import { TimeInputMinutes } from "src/shared/components/interactable/TimeInputMinutes";
import Button from "src/shared/components/interactable/Button";
import { showModal } from "src/shared/components/Modal";
import WorkSessionTableModal from "./WorkSessionTableModal";
import clsx from "clsx";
import { WorkSession } from "src/features/work-session/types/WorkSession";
import workSessionService from "src/features/work-session/services/workSessionService";
import { WorkSessionTimer } from "src/features/work-session/types/WorkSessionTimer";
import { TimeTrackStatus } from "src/features/time-track/types/TimeTrack";
import Activity from "src/features/activity/components/Activity";


interface Props {
    session: WorkSession;
    onSessionChange: (newSession: WorkSession) => void;

    onClose: () => void;

    readOnly?: boolean;

    // Content projection
    inAboveContent?: ReactNode;
    inBelowContent?: ReactNode;
}


export default function WorkSessionSettings({ session, onSessionChange, onClose, readOnly, inAboveContent, inBelowContent }: Props) {
    const [, setExpandDeletedActivities] = useState(false);

    const sessionHasActivities = session.activities.length > 0;

    const [deletedActivities, sessionTimerDuration] = useMemo(() => {
        const sessionTimerDuration = workSessionService.getTimerDurationInMinutes(session.timer);
        const deletedActivities = session.activities.filter(act => act.isDeleted);
        return [deletedActivities, sessionTimerDuration];
    }, [session]);

    const handleChangeTimer = (newTimer: WorkSessionTimer) => {
        onSessionChange({
            ...session,
            timer: newTimer
        });
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


            {inAboveContent}

            <div className="flex flex-row gap-5">
                <FormField title="Inicio" className="text-center">
                    <TimeInput
                        className="max-w-full"
                        time={session.timer.startOverride || (session.timer.start ? session.timer.start + 1 : undefined)}
                        // si es undefined tambien el override lo es
                        onChange={newStartTime => handleChangeTimer({
                            ...session.timer,
                            startOverride: newStartTime
                        })}
                        readOnly={readOnly}
                    />
                </FormField>

                <FormField title="Fin" className="text-center">
                    <TimeInput
                        className={clsx("max-w-full",
                            { "text-red-400": session.timer.status === TimeTrackStatus.RUNNING && !session.timer.endOverride }
                        )}
                        time={session.timer.endOverride || session.timer.end || undefined}
                        onChange={newEndTime => handleChangeTimer({
                            ...session.timer,
                            endOverride: newEndTime
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


            {inBelowContent}

        </>
    );
}