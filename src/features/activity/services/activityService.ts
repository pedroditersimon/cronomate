
import { Activity } from "src/features/activity/types/Activity";
import timeTrackService from "src/features/time-track/services/timeTrackService";
import { TimeTrack } from "src/features/time-track/types/TimeTrack";
import { Result, ok } from "src/shared/types/Result";


function add(list: Array<Activity>, activity: Activity): Array<Activity> {
    // already exists!
    if (list.some(item => item.id === activity.id)) {
        throw new Error(`The activity with ID ${activity.id} already exists.`);
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

function getAllElapsedTime(activities: Array<Activity>) {
    return activities.reduce((acc, activity) => {
        // dont include deleted activity
        if (activity.isDeleted) return acc;

        const elapsedTime = timeTrackService.getAllElapsedTime(activity.tracks);
        return elapsedTime > 0
            ? acc + elapsedTime
            : acc;
    }, 0);
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
    stop,
    stopAll,
    hasChanges,

    // Handle tracks
    setTrack,
    addTrack,
    hasRunningTracks,
    orderTracksByStartTime,
    getAllElapsedTime,
    updateRunningTracks
};