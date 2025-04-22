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
import { TimeDurationInput } from "src/shared/components/interactable/TimeDurationInput";
import { TimeInputHHmm } from "src/shared/components/interactable/TimeInputHHmm";
import { Duration, Interval } from "luxon";


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

    const [archivedActivities] = useMemo(() => {
        const archivedActivities = session.activities
            .filter(act => act.isDeleted || activityService.hasArchivedTracks(act));

        return [archivedActivities];
    }, [session.activities]);

    // const handleChangeTimer = (newTimer: WorkSessionTimer) => {
    //     onSessionChange({
    //         ...session,
    //         timer: newTimer
    //     });
    // }

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



    const handleSetMaxDuration = (newMaxDuration: typeof session.durationLimit) => {
        let calculatedMillis = newMaxDuration.millis;
        if (newMaxDuration.start && newMaxDuration.end) {
            const interval = Interval.fromISO(`${newMaxDuration.start}/${newMaxDuration.end}`);
            calculatedMillis = interval.isValid
                ? interval.length("milliseconds") : null;
        }

        onSessionChange({
            ...session,
            durationLimit: {
                ...newMaxDuration,
                millis: calculatedMillis
            },
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
                    <TimeInputHHmm
                        className={clsx(
                            "max-w-full",
                            {
                                "text-gray-500 hover:text-white": !session.durationLimit?.start
                            }
                        )}
                        timeHHmm={session.durationLimit?.start ?? ""}
                        onChange={newTime => handleSetMaxDuration({
                            ...session.durationLimit,
                            start: newTime
                        })}
                        readOnly={!canEdit}
                    />
                </FormField>

                <FormField title="Fin" className="text-center">
                    <TimeInputHHmm
                        className={clsx(
                            "max-w-full",
                            {
                                "text-gray-500 hover:text-white": !session.durationLimit?.end
                            }
                        )}
                        timeHHmm={session.durationLimit?.end ?? ""}
                        onChange={newTime => handleSetMaxDuration({
                            ...session.durationLimit,
                            end: newTime
                        })}
                        readOnly={!canEdit}
                    />
                </FormField>

                <FormField title="Duración" className="text-center">
                    <TimeDurationInput
                        className={clsx("max-w-full",
                            {
                                "text-gray-500 hover:text-white": !session.durationLimit?.millis
                            }
                        )}
                        millis={session.durationLimit?.millis ?? 0}
                        onChange={newDuration => handleSetMaxDuration({
                            ...session.durationLimit,
                            start: null,
                            end: null,
                            millis: newDuration
                        })}
                        readOnly={!canEdit}
                    />
                </FormField>
            </div>

            <FormField
                title="Umbral de inactividad"
                tooltip={{
                    text: "Excluir los lapsos sin actividad que superen este umbral.",
                }}
            >
                <TimeDurationInput
                    className={clsx("max-w-full")}
                    millis={session.inactivityThresholdMs || 60 * 60 * 1000} // default 1h
                    onChange={newThreshold => onSessionChange({
                        ...session,
                        inactivityThresholdMs: newThreshold
                    })}
                />
            </FormField>


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