import { Activity } from "src/features/activity/types/Activity";
import { TimeTrackStatus } from "src/features/time-track/types/TimeTrack";

export const newActivityMock: Activity = {
    id: "activityMock",
    title: "Nueva actividad",
    tracks: [{
        id: "recordMock",
        start: 0,
        end: null,
        status: TimeTrackStatus.STOPPED
    }],
    isCollapsed: true,
};