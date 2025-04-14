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


function getAllElapsedTime(timers: Array<TimeTrack>): number {
    return timers.reduce((acc, timer) => {
        // dont include archived timers
        if (timer.status === TimeTrackStatus.ARCHIVED) return acc;

        const elapsedTime = getElapsedTime(toDate(timer.start, false), toDate(timer.end, false));
        return elapsedTime > 0
            ? acc + elapsedTime
            : acc;
    }, 0);
}

// Ordenar los registros por start sin mutar el array original
function orderAllByStartTime(timers: Array<TimeTrack>): Array<TimeTrack> {
    return orderBy(timers, ['start'], ['asc']);
}

// Deprecar
function getUntrackedPeriods(timers: Array<TimeTrack>, range?: TimeTrack): Array<TimeTrack> {
    // Ordenar los registros por start
    const orderedTimers = orderAllByStartTime(timers);

    const untimeredPeriods: Array<TimeTrack> = [];

    let lastEndTime = 0;
    const firstTimer = orderedTimers[0];

    // Usar range.start si está definido, si no el primer end
    if (range?.start) {
        lastEndTime = range.start;
    } else if (firstTimer?.end && firstTimer.status !== TimeTrackStatus.ARCHIVED) {
        lastEndTime = firstTimer.end ?? 0;
    }

    for (let i = 0; i < orderedTimers.length; i++) {
        const currentTimer = orderedTimers[i];
        if (currentTimer.status === TimeTrackStatus.ARCHIVED || !hasEndTime(currentTimer)) continue;

        // Ajustar start y end para que queden dentro del rango inicial y final
        const currentStartTime = currentTimer.start || 0;
        const currentEndTime = currentTimer.end || 0;

        if (range && range.end && currentStartTime > range.end) {
            break; // Salir si el start actual excede finalTime
        }

        // Comparar lastEndTime con el start actual, asegurándose de que se considere dentro del rango
        if (lastEndTime < currentStartTime) {
            const gapStart = Math.max(lastEndTime, range?.start || 0);
            const gapEnd = Math.min(currentStartTime, range?.end || Number.MAX_SAFE_INTEGER);

            if (gapStart < gapEnd) {
                untimeredPeriods.push({
                    id: `gap-${i}`,
                    start: gapStart,
                    end: gapEnd,
                    status: TimeTrackStatus.STOPPED
                });
            }
        }

        // Actualizar lastEndTime, considerando el rango final
        lastEndTime = Math.max(lastEndTime, currentEndTime);
        if (range && range.end) {
            lastEndTime = Math.min(lastEndTime, range?.end);
        }
    }

    // Si aún hay tiempo no registrado después del último registro hasta finalTime
    if (range && range.end && lastEndTime < range?.end) {
        untimeredPeriods.push({
            id: `gap-final`,
            start: lastEndTime,
            end: range?.end,
            status: TimeTrackStatus.STOPPED
        });
    }

    return untimeredPeriods;
}

// New version
function _getUntrackedPeriods(tracks: Array<TimeTrack>): Array<TimeTrack> {

    const validTracks = tracks.filter(track => {
        if (track.status === TimeTrackStatus.ARCHIVED) return false; // Archived tracks
        if (!track.start || !track.end) return false; // Invalid track
        if (track.start > track.end) return false; // Invalid track
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
    const sorted = orderBy(merged, ['start'], ['asc']);

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
    const untrackedPeriods: Array<TimeTrack> = sorted.map((interval, i) => {
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
    getAllElapsedTime, orderAllByStartTime, getUntrackedPeriods, getArchived, updateRun
};