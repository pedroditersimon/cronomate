import { orderBy } from "lodash";
import { TimeTrack, TimeTrackStatus } from "../types/TimeTrack";
import { toDate } from "src/shared/utils/TimeUtils";
import { err, ok, Result } from "src/shared/types/Result";
import { DateTime, Interval } from "luxon";

function add(list: Array<TimeTrack>, track: TimeTrack): Result<TimeTrack[]> {
    // already exists!
    if (list.some(item => item.id === track.id)) {
        return err(`The track with ID ${track.id} already exists.`);
    }

    return ok([...list, { ...track }]);
}

function set(list: Array<TimeTrack>, track: TimeTrack): Array<TimeTrack> {
    let found = false;

    const updatedList = list.map(item => {
        if (item.id === track.id) {
            found = true;
            return { ...track };
        }
        return item;
    });

    if (!found) {
        throw new Error(`The track with ID ${track.id} does not exist.`);
    }

    return updatedList;
}



function stop(track: TimeTrack): TimeTrack {
    if (track.status !== TimeTrackStatus.RUNNING)
        return track;

    return {
        ...track,
        end: DateTime.now().toFormat("HH:mm"), // now
        status: TimeTrackStatus.STOPPED,
    } as TimeTrack;
};

function stopAll(list: Array<TimeTrack>): Array<TimeTrack> {
    return list.map(track => stop(track));
};

function hasRunning(list: Array<TimeTrack>): boolean {
    return list.some(track => track.status === TimeTrackStatus.RUNNING);
}
function hasArchived(list: Array<TimeTrack>): boolean {
    return list.some(track => track.status === TimeTrackStatus.ARCHIVED);
}
function hasUnarchived(list: Array<TimeTrack>): boolean {
    return list.some(track => track.status !== TimeTrackStatus.ARCHIVED);
}

function hasEndTime(track: TimeTrack | undefined | null): boolean {
    return (track?.end && track?.end !== null) === true;
}

function hasAnyEndTime(list: Array<TimeTrack>): boolean {
    return list.some(track => hasEndTime(track));
}

function toInterval(track: TimeTrack) {
    if (!track || !track.start || !track.end) return Interval.invalid("invalid start or end");

    const startDate = DateTime.fromFormat(track.start, "HH:mm");
    const endDate = DateTime.fromFormat(track.end, "HH:mm");

    return Interval.fromDateTimes(startDate, endDate);
}

function getElapsedMs(track: TimeTrack) {
    const interval = toInterval(track);
    if (!interval.isValid) return 0;

    return interval.length("milliseconds");
}

function getAllElapsedMs(tracks: Array<TimeTrack>): number {
    return tracks.reduce((acc, track) => {
        // dont include archived tracks
        if (track.status === TimeTrackStatus.ARCHIVED) return acc;

        const elapsedTime = getElapsedMs(track);
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
        const durationMs = getElapsedMs(track);
        if (durationMs < 59 * 1000) return false;

        return true;
    });

    // tracks to intervals
    const intervals = validTracks.map(toInterval);

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
            start: interval.start!.toFormat("HH:mm"),
            end: interval.end!.toFormat("HH:mm"),
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

    const hhmm_now = DateTime.now().toFormat("HH:mm");

    return {
        ...track,
        start: track.start || hhmm_now,
        end: hhmm_now,
    } as TimeTrack;
}

export default {
    add, set, stop, stopAll,
    hasRunning, hasArchived, hasUnarchived, hasEndTime, hasAnyEndTime,
    getElapsedMs, getAllElapsedMs, orderAllByStartTime,
    getUntrackedPeriods, getArchived, updateRun
};