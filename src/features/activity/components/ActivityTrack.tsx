import { CircleIcon, TrashIcon, UndoIcon } from "src/shared/assets/Icons";
import { getElapsedTime, isNow, toDate, convertElapsedTimeToText } from "src/shared/utils/TimeUtils";
import { useMemo } from "react";
import clsx from "clsx";
import { TimeInput } from "src/shared/components/interactable/TimeInput";
import Clickable from "src/shared/components/interactable/Clickable";
import { TimeTrack, TimeTrackStatus } from "src/features/time-track/types/TimeTrack";
import { isActionAllowed } from "src/shared/utils/checkAllowedActions";

export type TimeTrackActions = "all" | "none" | ("edit" | "archive" | "restore")[];

interface Props {
    track: TimeTrack;
    onChange: (newTimer: TimeTrack) => void;
    allowedActions?: TimeTrackActions;
}


export default function ActivityTrack({ track, onChange, allowedActions = "all" }: Props) {

    // calculate elapsed time in text format
    const elapsedTimeTxt = useMemo(() => {
        const elapsedTime = getElapsedTime(toDate(track.start, false), toDate(track.end, false));
        return convertElapsedTimeToText(elapsedTime);
    }, [track]);


    // no TimeRecord
    if (!track)
        return <div className="text-red-400">Error: Null TimeRecord.</div>;


    const handleArchive = () => {
        onChange({
            ...track,
            status: TimeTrackStatus.ARCHIVED,
        });
    }

    // Allowed actions
    const canEdit = isActionAllowed(allowedActions, "edit");
    const canArchive = isActionAllowed(allowedActions, "archive");
    const canRestore = isActionAllowed(allowedActions, "restore");

    const handleUndoArchive = () => {
        if (track.status !== TimeTrackStatus.ARCHIVED)
            return;

        onChange({
            ...track,
            status: TimeTrackStatus.STOPPED,
        });
    }

    return (
        <div
            className={clsx("flex flex-row gap-1 transition-opacity duration-300 group",
                { "strike-div": track.status === TimeTrackStatus.ARCHIVED }
            )}
        >
            <CircleIcon
                className={clsx({
                    "bg-red-400": track.status === TimeTrackStatus.RUNNING,
                    "bg-gray-700": track.status === TimeTrackStatus.STOPPED
                })}
            />


            <TimeInput
                time={track.start}
                className={clsx({ "opacity-50": track.status === TimeTrackStatus.ARCHIVED })}
                onChange={newStartTime => onChange({
                    ...track,
                    start: newStartTime ?? track.start // update or keep same
                })}
                readOnly={!canEdit || track.status === TimeTrackStatus.ARCHIVED}
            />
            -
            <TimeInput
                time={track.end ?? undefined}
                className={clsx({ "opacity-50": track.status === TimeTrackStatus.ARCHIVED })}
                onChange={newEndTime => {
                    const updatedEndTime = newEndTime ?? track.end;
                    const shouldStop = newEndTime !== null && !isNow(newEndTime);

                    onChange({
                        ...track,
                        end: updatedEndTime,
                        status: shouldStop ? TimeTrackStatus.STOPPED : track.status
                    });
                }}
                running={track.status === TimeTrackStatus.RUNNING}
                readOnly={!canEdit || track.status === TimeTrackStatus.ARCHIVED}
            />

            {/* Elapsed Time text */}
            <span
                className={clsx("ml-auto content-center box-border",
                    {
                        "text-red-400": track.status === TimeTrackStatus.RUNNING,
                        "pr-1": !canEdit,
                        "opacity-50": track.status === TimeTrackStatus.ARCHIVED
                    }
                )}
                children={elapsedTimeTxt}
            />

            {/* Archive btn */}
            {canArchive && track.status !== TimeTrackStatus.ARCHIVED &&
                <Clickable
                    className="hidden group-hover:block"
                    children={<TrashIcon className="hover:bg-red-400 size-5" />}
                    onClick={handleArchive}
                    tooltip={{ text: "Archivar" }}
                />
            }

            {/* Restore btn */}
            {canRestore && track.status === TimeTrackStatus.ARCHIVED &&
                <Clickable
                    className="hidden group-hover:block"
                    children={<UndoIcon className="hover:bg-red-400 size-5" />}
                    onClick={handleUndoArchive}
                    tooltip={{ text: "Restaurar" }}
                />
            }

        </div>
    );
}