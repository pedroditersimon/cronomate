import { ReactNode, useMemo, useState } from "react";
import { ChevronVerticalIcon, CrossIcon } from "src/assets/Icons";
import ContainerTopbar from "src/shared/layouts/ContainerTopbar";
import FormField from "src/shared/components/forms/FormField";
import { TimeInput } from "src/shared/components/interactable/TimeInput";
import HSeparator from "src/shared/layouts/HSeparator";
import Clickable from "src/shared/components/interactable/Clickable";
import Button from "src/shared/components/interactable/Button";
import { showModal } from "src/shared/components/Modal";
import WorkSessionTableModal from "./WorkSessionTableModal";
import clsx from "clsx";
import { WorkSession } from "src/features/work-session/types/WorkSession";
import workSessionService from "src/features/work-session/services/workSessionService";
import { WorkSessionTimer } from "src/features/work-session/types/WorkSessionTimer";
import { TimeTrack, TimeTrackStatus } from "src/features/time-track/types/TimeTrack";
import Activity from "src/features/activity/components/Activity";
import { convertElapsedTimeToText } from "src/shared/utils/TimeUtils";
import activityService from "src/features/activity/services/activityService";


interface Props {
    session: WorkSession;
    onSessionChange: (newSession: WorkSession) => void;

    onClose: () => void;

    // Content projection
    inAboveContent?: ReactNode;
    inBelowContent?: ReactNode;

    // Allowed actions
    canEdit?: boolean;
    canRestore?: boolean;
}


export default function WorkSessionSettings({
    session,
    onSessionChange,
    onClose,

    // Content projection
    inAboveContent,
    inBelowContent,

    // Allowed actions
    canEdit = true,
    canRestore = true,
}: Props) {
    const [expandArchivedActivities, setExpandArchivedActivities] = useState(false);

    const sessionHasActivities = session.activities.length > 0;

    const [archivedActivities, timerDurationStr] = useMemo(() => {
        const archivedActivities = session.activities
            .filter(act => act.isDeleted || activityService.hasArchivedTracks(act));

        const timerDurationMinutes = workSessionService.getTimerDurationInMinutes(session.timer);
        const timerDurationMillis = timerDurationMinutes * 60 * 1000;
        const timerDurationStr = convertElapsedTimeToText(timerDurationMillis) ?? "-";
        return [archivedActivities, timerDurationStr];
    }, [session.timer, session.activities]);

    const handleChangeTimer = (newTimer: WorkSessionTimer) => {
        onSessionChange({
            ...session,
            timer: newTimer
        });
    }

    const handleRestoreActivity = (activityId: string) => {
        const newActivities = session.activities.map(act => {
            if (act.id === activityId) {
                return { ...act, isDeleted: false };
            }
            return act;
        });

        onSessionChange({
            ...session,
            activities: newActivities
        });
    };

    const handleSetActivityTracks = (activityId: string, newTracks: TimeTrack[]) => {
        const newActivities = session.activities.map(act => {
            if (act.id === activityId) {
                return { ...act, tracks: newTracks };
            }
            return act;
        });

        onSessionChange({
            ...session,
            activities: newActivities
        });
    };

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
                        readOnly={!canEdit}
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
                        readOnly={!canEdit}
                    />
                </FormField>

                <FormField title="Duración" className="text-center">
                    <span>{timerDurationStr}</span>
                </FormField>
            </div>


            <FormField
                title="Tabla de actividades"
                tooltip={{
                    text: "Genera una tabla con las actividades de la jornada y sus duraciones."
                }}
            >
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
                    <p className="text-gray-400 font-semibold">Actividades archivadas</p>
                    <Clickable className="p-0 hover:bg-gray-700"
                        children={<ChevronVerticalIcon />}
                        onClick={() => setExpandArchivedActivities(prev => !prev)}
                        tooltip={{ text: "Expandir", position: "left" }}
                    />
                </div>
                <HSeparator className="mb-2" />

                {/* Archived activities */}
                <div className="flex flex-col gap-2">
                    {archivedActivities.length === 0
                        ? <p className="text-gray-500 text-sm">No hay actividades archivadas.</p>
                        : archivedActivities.map(activity => (
                            <Activity
                                key={activity.id}
                                activity={activity}
                                onActivityChange={act => {
                                    // if it was deleted and now is not (restored)
                                    if (activity.isDeleted && !act.isDeleted) {
                                        handleRestoreActivity(act.id);
                                    }
                                    // otherwise, just update the tracks, they can be restored
                                    else {
                                        handleSetActivityTracks(act.id, act.tracks);
                                    }
                                }}
                                showArchivedTracks

                                isExpanded={expandArchivedActivities}

                                canRestore={canRestore}
                                canArchive={false}
                                canEdit={false}
                            />
                        ))
                    }
                </div>
            </div>


            {inBelowContent}

        </>
    );
}