import { Activity } from "src/features/activity/types/Activity";
import { pauseActivityMock } from "src/features/session/mocks/pauseActivityMock";
import timeTrackService from "src/features/time-track/services/timeTrackService";
import { TimeTrack, TimeTrackStatus } from "src/features/time-track/types/TimeTrack";
import { DateTime, Interval } from "luxon";
import { findLast } from "lodash";
import { generateId } from "src/shared/utils/generateId";
import { Result, ok } from "src/shared/types/Result";


function add(list: Array<Activity>, activity: Activity, fusion: boolean = true): Array<Activity> {

    // activity id already exists!
    if (list.some(item => item.id === activity.id)) {
        throw new Error(`The activity with ID ${activity.id} already exists.`);
    }

    // activity title already exists, fusion tracks
    const matchingActivity = list.find(item =>
        !item.isDeleted && item.title.toLowerCase().trim() === activity.title.toLowerCase().trim());

    if (matchingActivity && fusion) {
        if (activity.tracks.length === 1 && activity.tracks[0].status === TimeTrackStatus.RUNNING) {
            return set(list, start(matchingActivity));
        }
        return set(list, {
            ...matchingActivity,
            // fusion tracks
            tracks: [...matchingActivity.tracks, ...activity.tracks]
        });
    }

    return [...list, { ...activity }];
}



function set(list: Array<Activity>, activity: Activity): Array<Activity> {
    let found = false;

    const updatedList = list.map(item => {
        if (item.id === activity.id) {
            found = true;
            return { ...activity };
        }
        return item;
    });

    if (!found) {
        throw new Error(`The activity with ID ${activity.id} does not exist.`);
    }

    return updatedList;
}


function start(activity: Activity): Activity {
    if (hasRunningTracks(activity)) return activity;

    const now = DateTime.now();
    const resumable = findLast(activity.tracks, track => {
        if (!track.end) return true;
        const interval = Interval.fromDateTimes(DateTime.fromFormat(track.end, "HH:mm"), now);
        return !interval.isValid || interval.length("milliseconds") <= 59 * 1000;
    });
    if (resumable) {
        return setTrack(activity, { ...resumable, status: TimeTrackStatus.RUNNING });
    }

    const hhmm = now.toFormat("HH:mm");
    const result = addTrack(activity, {
        id: generateId(), start: hhmm, end: hhmm, status: TimeTrackStatus.RUNNING,
    });
    return result.success ? result.data : activity;
}

function stop(activity: Activity): Activity {
    return {
        ...activity,
        tracks: timeTrackService.stopAll(activity.tracks)
    };
}

function stopAll(list: Array<Activity>): Array<Activity> {
    return list.map(activity => stop(activity));
};


function hasChanges(activity: Activity, mock: Activity) {
    if (!activity.title.includes(mock.title)) return true; // title has changed
    return timeTrackService.hasAnyEndTime(activity.tracks); // tracks has changed
}

function getAllElapsedTime(activities: Array<Activity>, excludePauses = true) {
    return activities.reduce((acc, activity) => {
        // dont include deleted activity
        if (activity.isDeleted) return acc;
        if (excludePauses && activity.id === pauseActivityMock.id) return acc;

        const elapsedTime = timeTrackService.getAllElapsedMs(activity.tracks);
        return elapsedTime > 0
            ? acc + elapsedTime
            : acc;
    }, 0);
}

function isPauseActivity(activity: Activity): boolean {
    return activity.title.trim().toLowerCase() === pauseActivityMock.title.toLowerCase();
}

//#region Handle tracks

function setTrack(activity: Activity, track: TimeTrack): Activity {
    const updatedActivity = {
        ...activity,
        tracks: timeTrackService.set(activity.tracks, track)
    };

    // order tracks when add
    return orderTracksByStartTime(updatedActivity);
}

function addTrack(activity: Activity, track: TimeTrack): Result<Activity> {
    const tracksResult = timeTrackService.add(activity.tracks, track);
    if (!tracksResult.success)
        return tracksResult;

    const updatedActivity: Activity = {
        ...activity,
        tracks: tracksResult.data
    };

    // order tracks when add
    const orderedTracks = orderTracksByStartTime(updatedActivity)
    return ok(orderedTracks);
}

function hasRunningTracks(activity: Activity): boolean {
    return timeTrackService.hasRunning(activity.tracks);
}

function hasArchivedTracks(activity: Activity): boolean {
    return timeTrackService.hasArchived(activity.tracks);
}

function hasUnarchivedTracks(activity: Activity): boolean {
    return timeTrackService.hasUnarchived(activity.tracks);
}

function getEarliestStartTime(activity: Activity): string | null {
    return activity.tracks.reduce<string | null>((earliestStartTime, track) => {
        if (!track.start) return earliestStartTime;
        if (!earliestStartTime || track.start < earliestStartTime) return track.start;
        return earliestStartTime;
    }, null);
}

function orderTracksByStartTime(activity: Activity): Activity {
    return {
        ...activity,
        tracks: timeTrackService.orderAllByStartTime(activity.tracks)
    };
}

function updateRunningTracks(activity: Activity): Activity {
    return {
        ...activity,
        tracks: activity.tracks.map(track =>
            timeTrackService.updateRun(track)
        )
    };
}

export default {
    // Handle activities
    add,
    set,
    start,
    stop,
    stopAll,
    hasChanges,
    isPauseActivity,

    // Handle tracks
    setTrack,
    addTrack,
    hasRunningTracks,
    hasArchivedTracks,
    hasUnarchivedTracks,
    getEarliestStartTime,
    orderTracksByStartTime,
    getAllElapsedTime,
    updateRunningTracks
};
