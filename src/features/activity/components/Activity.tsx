import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { ChevronDownIcon, ChevronRightIcon, PlayIcon, StopIcon, TrashIcon, UndoIcon } from "src/assets/Icons";
import { isNow, toDate, convertElapsedTimeToText } from "src/shared/utils/TimeUtils";
import { Activity as ActivityType } from "src/features/activity/types/Activity";
import clsx, { ClassValue } from "clsx";
import HSeparator from "src/shared/layouts/HSeparator";
import { generateId } from "src/shared/utils/generateId";
import { findLast } from "lodash";
import timeTrackService from "src/features/time-track/services/timeTrackService";
import activityService from "../services/activityService";
import Clickable from "src/shared/components/interactable/Clickable";
import { TimeTrack, TimeTrackStatus } from "src/features/time-track/types/TimeTrack";
import ActivityTrack from "src/features/activity/components/ActivityTrack";
import { pauseActivityMock } from "src/features/session/mocks/pauseActivityMock";
import { DateTime, Interval } from "luxon";

export type ActivityActions = "all" | "none" | ("edit" | "archive" | "restore")[];

interface Props {
    className?: ClassValue;
    activity: ActivityType;
    onActivityChange: (newActivity: ActivityType) => void;
    onTitleConfirm?: (newTitle: string) => void;

    showArchivedTracks?: boolean;
    selectTitleOnClick?: boolean;

    isExpanded?: boolean;

    // Allowed actions
    canEdit?: boolean;
    canArchive?: boolean;
    canRestore?: boolean;
}

export type ActivityHandle = {
    focusTitle: () => void;
};

const Activity = forwardRef<ActivityHandle, Props>(({
    className,
    activity,
    onActivityChange,
    onTitleConfirm,
    showArchivedTracks,
    selectTitleOnClick,

    isExpanded: _isExpanded = false,

    // Allowed actions
    canEdit = true,
    canArchive = true,
    canRestore = true
}, ref) => {
    // local states
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [focused, setFocused] = useState(false);
    const [title, setTitle] = useState(activity.title);
    const [isExpanded, setIsExpanded] = useState(_isExpanded);

    // sync isExpanded with prop
    useEffect(() => setIsExpanded(_isExpanded), [_isExpanded]);

    useImperativeHandle(ref, () => ({
        focusTitle: () => {
            setFocused(true);
            inputRef.current?.select();
        },
    }));

    // sync title if activity changes
    useEffect(() => {
        if (focused) return; // dont change title if focused
        setTitle(activity.title);
    }, [activity]);


    // calculated states
    const [hasRunningTracks, totalElapsedTimeTxt] = useMemo(() => {

        const totalElapsedTime = timeTrackService.getAllElapsedMs(activity.tracks);
        const totalElapsedTimeTxt = convertElapsedTimeToText(totalElapsedTime);

        const hasRunningTracks = activityService.hasRunningTracks(activity);

        return [hasRunningTracks, totalElapsedTimeTxt];
    }, [activity]);


    const handleRun = () => {
        const hhmm_now = DateTime.now().toFormat("HH:mm");

        if (hasRunningTracks) {
            // set endTime to Now on running tracks
            const newTracks = activity.tracks.map(track => track.status === TimeTrackStatus.RUNNING
                ? { ...track, end: hhmm_now, status: TimeTrackStatus.STOPPED }
                : track
            );
            onActivityChange({ ...activity, tracks: newTracks });
            return; // dont do more
        }

        function isResumable(track: TimeTrack, threholdMs: number) {
            if (!track.end) return true;

            const now = DateTime.now();
            const endTime = DateTime.fromFormat(track.end, "HH:mm");

            const interval = Interval.fromDateTimes(endTime, now);
            if (!interval.isValid) return true;

            const durationMs = interval.length("milliseconds");
            return durationMs <= threholdMs;
        }

        // Find the last resumable track (within one minute of current time) 
        const lastResumableRecord = findLast(activity.tracks, track => isResumable(track, 59 * 1000));

        // Resume running the last record if found
        if (lastResumableRecord) {
            handleSetTrack({
                ...lastResumableRecord,
                status: TimeTrackStatus.RUNNING
            });
            return; // dont do more
        }

        // add a new running track
        const newActivityResult = activityService.addTrack(activity, {
            id: generateId(),
            start: hhmm_now,
            end: hhmm_now,
            status: TimeTrackStatus.RUNNING,
        });
        if (!newActivityResult.success)
            return;

        onActivityChange(newActivityResult.data);
    }


    const handleSetTrack = (newTrack: TimeTrack) => {
        onActivityChange(activityService.setTrack(activity, newTrack));
    }

    const handleSetTitle = (newTitle: string) => {
        onActivityChange({ ...activity, title: newTitle });
    }

    const handleDelete = () => {
        onActivityChange({
            ...activity,
            isDeleted: true,
        });
    }

    const handleUndoArchive = () => {
        onActivityChange({
            ...activity,
            isDeleted: false,
        });
    };

    return (
        <div className={clsx("flex flex-col gap-1 min-w-80", className)}  >
            <div className="flex flex-row gap-1">
                {/* Collapse btn */}
                <Clickable
                    className="hover:bg-gray-700"
                    onClick={() => setIsExpanded(prev => !prev)}
                    children={isExpanded
                        ? <ChevronDownIcon />
                        : <ChevronRightIcon />}
                />

                {/* Title input */}
                <div
                    className={clsx("group flex flex-row gap-1 w-full box-border rounded-md pl-2 transition-all duration-300", {
                        "bg-red-400": hasRunningTracks,
                        "bg-gray-700": focused,
                        "hover:bg-gray-700": canEdit && !hasRunningTracks,
                        "strike-div": activity.isDeleted
                    })}
                >
                    <input
                        ref={inputRef}
                        className={clsx("bg-transparent outline-none mr-auto basis-1/2 group",
                            { "opacity-50": activity.isDeleted })}
                        placeholder={activity.title}
                        value={title}
                        readOnly={!canEdit}
                        onChange={e => {
                            if (!canEdit) return;
                            setTitle(e.target.value);
                        }}
                        onFocus={() => {
                            if (!canEdit) return;
                            setFocused(true);
                        }}

                        onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                            if (selectTitleOnClick) e.currentTarget.select();
                        }}

                        // on confirm input
                        onBlur={() => {
                            if (!canEdit) return;
                            setFocused(false);
                            handleSetTitle(title);
                        }}
                        onKeyUp={e => {
                            if (!canEdit) return;
                            if (e.key === "Enter") {
                                e.currentTarget.blur();
                                if (onTitleConfirm) setTimeout(() => onTitleConfirm(title), 50);
                                return;
                            }
                            // reset title
                            if (e.key === "Escape") {
                                setTitle(activity.title);

                                // Delay blur to ensure the new state is applied, before calling blur.
                                // This prevents run blur callback with an outdated state.
                                const element = e.currentTarget;
                                setTimeout(() => element.blur(), 1); return;
                            }
                        }}
                    />
                    <span className={clsx({ "pr-1": !canEdit })} >
                        {totalElapsedTimeTxt}
                    </span>

                    {/* Archive activity btn */}
                    {canArchive && activity.id !== pauseActivityMock.id &&
                        <Clickable
                            className="hidden group-hover:block opacity-100"
                            children={
                                <TrashIcon
                                    className={clsx("hover:bg-red-400 size-5",
                                        { "hover:bg-white hover:text-red-400": hasRunningTracks })}
                                />
                            }
                            onClick={handleDelete}
                            tooltip={{ text: "Archivar", position: "left" }}
                        />
                    }

                    {/* Restore btn */}
                    {canRestore && activity.isDeleted &&
                        <Clickable
                            className="hidden group-hover:block"
                            children={<UndoIcon className="hover:bg-red-400 size-5" />}
                            onClick={handleUndoArchive}
                            tooltip={{ text: "Restaurar", position: "left" }}
                        />
                    }

                    {/* Play/Stop activity btn */}
                    {canEdit &&
                        <Clickable
                            onClick={handleRun}
                            children={hasRunningTracks
                                ? <StopIcon className="hover:bg-white hover:text-red-400" />
                                : <PlayIcon className="hover:bg-red-400" />}
                        />
                    }

                </div>
            </div>


            <HSeparator />


            {/* Track list */}
            <div className="flex flex-col gap-1 ml-6">
                {activity.tracks.map((track, i) => {
                    if (!showArchivedTracks && track.status === TimeTrackStatus.ARCHIVED) return;
                    if (!isExpanded && track.status !== TimeTrackStatus.RUNNING) return;
                    return (<>
                        <ActivityTrack
                            key={track.id}
                            track={track}
                            onChange={handleSetTrack}

                            canEdit={canEdit}
                            canArchive={canArchive}
                            canRestore={canRestore}
                        />
                        {i < activity.tracks.length - 1 && <HSeparator />}
                    </>)
                })}
            </div>

        </div>
    );
});


export default Activity;