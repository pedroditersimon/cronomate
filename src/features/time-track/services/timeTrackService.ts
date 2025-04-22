import { orderBy } from "lodash";
import { TimeTrack, TimeTrackStatus } from "../types/TimeTrack";
import { getElapsedTime, toDate } from "src/shared/utils/TimeUtils";
import { err, ok, Result } from "src/shared/types/Result";
import { Interval } from "luxon";

function add(list: Array<TimeTrack>, timer: TimeTrack): Result<TimeTrack[]> {
    // already exists!
    if (list.some(item => item.id === timer.id)) {
        return err(`The timer with ID ${timer.id} already exists.`);
    }

    return ok([...list, { ...timer }]);
}

function set(list: Array<TimeTrack>, timer: TimeTrack): Array<TimeTrack> {
    let found = false;

    const updatedList = list.map(item => {
        if (item.id === timer.id) {
            found = true;
            return { ...timer };
        }
        return item;
    });

    if (!found) {
        throw new Error(`The timer with ID ${timer.id} does not exist.`);
    }

    return updatedList;
}



function stop(timer: TimeTrack): TimeTrack {
    if (timer.status !== TimeTrackStatus.RUNNING)
        return timer;

    return {
        ...timer,
        end: toDate().getTime(), // now
        status: TimeTrackStatus.STOPPED,
    };
};

function stopAll(list: Array<TimeTrack>): Array<TimeTrack> {
    return list.map(timer => stop(timer));
};

function hasRunning(list: Array<TimeTrack>): boolean {
    return list.some(timer => timer.status === TimeTrackStatus.RUNNING);
}
function hasArchived(list: Array<TimeTrack>): boolean {
    return list.some(timer => timer.status === TimeTrackStatus.ARCHIVED);
}
function hasUnarchived(list: Array<TimeTrack>): boolean {
    return list.some(timer => timer.status !== TimeTrackStatus.ARCHIVED);
}

function hasEndTime(timer: TimeTrack | undefined | null): boolean {
    return timer?.end !== null && timer?.end !== undefined;
}

function hasAnyEndTime(list: Array<TimeTrack>): boolean {
    return list.some(timer => hasEndTime(timer));
}

function getTrackElapsedTime(track: TimeTrack) {
    return getElapsedTime(toDate(track.start, false), toDate(track.end, false));
}

function getAllElapsedTime(tracks: Array<TimeTrack>): number {
    return tracks.reduce((acc, track) => {
        // dont include archived tracks
        if (track.status === TimeTrackStatus.ARCHIVED) return acc;

        const elapsedTime = getTrackElapsedTime(track);
        return elapsedTime > 0
            ? acc + elapsedTime
            : acc;
    }, 0);
}

// Ordenar los registros por start sin mutar el array original
function orderAllByStartTime(timers: Array<TimeTrack>): Array<TimeTrack> {
    return orderBy(timers, ['start'], ['asc']);
}


function getUntrackedPeriods(tracks: Array<TimeTrack>): Array<TimeTrack> {

    const validTracks = tracks.filter(track => {
        if (track.status === TimeTrackStatus.ARCHIVED) return false; // Archived tracks
        if (!track.start || !track.end) return false; // Dosnt have start or end
        if (track.start > track.end) return false; // Start is greater than end

        // Less than 59 seconds 
        const durationMs = track.end - track.start;
        if (durationMs < 59 * 1000) return false;

        return true;
    });

    // tracks to intervals
    const intervals = validTracks.map(t => {
        return Interval.fromDateTimes(
            toDate(t.start, false)!,
            toDate(t.end, false)!,
        );
    });

    // Merge overlapping intervals 
    const merged = Interval.merge(intervals);

    // Sort intervals by start
    const sorted = merged.sort((a, b) => a.start!.toMillis() - b.start!.toMillis());

    // Get gaps between intervals
    const gaps = [];
    for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1];
        const curr = sorted[i];
        if (prev.end! < curr.start!) {
            gaps.push(Interval.fromDateTimes(prev.end!, curr.start!));
        }
    }

    // intervals to tracks
    const untrackedPeriods: Array<TimeTrack> = gaps.map((interval, i) => {
        return {
            id: `untracked-${i}`,
            start: interval.start!.toMillis(),
            end: interval.end!.toMillis(),
            status: TimeTrackStatus.STOPPED,
        } as TimeTrack;
    });

    return untrackedPeriods;
}


function getArchived(timers: Array<TimeTrack>): Array<TimeTrack> {
    return timers.filter(r => r.status === TimeTrackStatus.ARCHIVED);
}

function updateRun(track: TimeTrack) {
    if (track.status !== TimeTrackStatus.RUNNING)
        return track;

    const now = toDate().getTime();

    return {
        ...track,
        start: track.start || now,
        end: now,
    };
}

export default {
    add, set, stop, stopAll, hasRunning, hasArchived, hasUnarchived, hasEndTime, hasAnyEndTime,
    getTrackElapsedTime, getAllElapsedTime, orderAllByStartTime, getUntrackedPeriods, getArchived, updateRun
};