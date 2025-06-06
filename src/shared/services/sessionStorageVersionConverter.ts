import { DateTime } from "luxon";
import { Activity } from "src/features/activity/types/Activity";
import sessionService from "src/features/session/services/sessionService";
import { Session } from "src/features/session/types/Session";

// [!] DONT use spread operator here

function convertSession(session: any, fromVersion: string, toVersion: string): any | null {
    let convertedSession = { value: session, newVersion: fromVersion };

    // already in target version
    if (fromVersion === toVersion)
        return session;

    while (convertedSession.newVersion !== toVersion) {
        const previousVersion = convertedSession.newVersion;
        convertedSession = convertSessionToNext(convertedSession.value, convertedSession.newVersion);

        // Cant convert anymore, return the session value
        if (convertedSession.newVersion === previousVersion) {
            break;
        }
    }

    // cant convert
    if (convertedSession.newVersion !== toVersion) {
        console.warn(`Cant convert session from v${fromVersion} to v${toVersion}`, session);
        return null
    }

    return convertedSession.value;
}

function convertSessionToNext(session: Session, fromVersion: string) {
    // 0.0.0 -> 0.1.0
    if (fromVersion === '0.0.0') {
        return {
            value: v0_0_0_to_v0_1_0(session),
            newVersion: '0.1.0'
        };
    }

    // 0.2.0 -> 0.3.0
    if (fromVersion === '0.2.0') {
        return {
            value: v0_2_0_to_v0_3_0(session),
            newVersion: '0.3.0'
        }
    }

    // 0.3.0 -> 0.4.0
    if (fromVersion === '0.3.0') {
        return {
            value: v0_3_0_to_v0_4_0(session),
            newVersion: '0.4.0'
        }
    }

    // keep same
    return {
        value: session,
        newVersion: fromVersion
    };
}

// Convert session from v0.3.0 to v0.4.0
function v0_3_0_to_v0_4_0(session: any) {
    // Changes:
    // 1. TimeTrack start and end changed from [epoch millis] to [24hs HH:mm] format

    const convertedActivities = session.activities.map((act: any) => ({
        id: act.id,
        title: act.title,
        description: act.description,
        isCollapsed: act.isCollapsed,
        isDeleted: act.isDeleted,
        tracks: act.tracks.map((track: any) => (
            {
                id: track.id,
                // convert epoch millis to HH:mm
                start: !track.start ? null
                    : DateTime.fromMillis(track.start).toFormat("HH:mm"),
                end: !track.end ? null
                    : DateTime.fromMillis(track.end).toFormat("HH:mm"),
                status: track.status,
            }
        ))
    })
    );

    return {
        id: session.id,
        activities: convertedActivities,
        createdTimestamp: session.createdTimestamp,
        durationLimit: session.durationLimit,
        inactivityThresholdMs: session.inactivityThresholdMs,
    }
}

// Convert session from v0.2.0 to v0.3.0
function v0_2_0_to_v0_3_0(session: any) {
    // Changes:
    // 1. removed 'timer: SessionTimer' prop
    // 2. renamed 'createdTimeStamp' to 'createdTimestamp'
    // 3. created 'durationLimit'
    // 4. moved timer.startOverride (epoch ms) -> durationLimit.start (HH:mm)
    // 5. moved timer.endOverride (epoch ms) -> durationLimit.end (HH:mm)
    // 6. created 'inactivityThresholdMs'

    // [!] Guard: Ensure the session is from the correct version by checking it
    if (!session.timer) return session;

    const startDate = DateTime.fromMillis(session.timer.startOverride ?? 0);
    const convertedStart = startDate.toFormat("HH:mm");

    const endDate = DateTime.fromMillis(session.timer.endOverride ?? 0);
    const convertedEnd = endDate.toFormat("HH:mm");

    let durationLimit: any = {
        start: convertedStart,
        end: convertedEnd,
        millis: null,
    };

    if (convertedStart && convertedEnd) {
        durationLimit = sessionService.calculateDurationLimit(durationLimit);
    }

    return {
        id: session.id,
        activities: session.activities,
        createdTimestamp: session.createdTimeStamp,
        durationLimit,
        inactivityThresholdMs: 60 * 60 * 1000 // 1h default
    }
}

// TODO: v0.1.0 to v0.2.0

// Convert session from v0.0.0 to v0.1.0
function v0_0_0_to_v0_1_0(session: any) {
    // Changes:
    // 1. maxDurationMinutes is moved to timer.maxDurationMinutes
    // 2. activities.deleted is renamed to activities.isDeleted
    // 3. activities.isCollapsed is added and set to true

    // [!] Guard: Ensure the session is from the correct version by checking it
    if (session.maxDurationMinutes === null) return session;

    return {
        ...session, // [!] DONT use spread operator here
        timer: {
            ...session.timer,
            maxDurationMinutes: session.maxDurationMinutes // 1
        },
        activities: session.activities.map((activity: any) => ({
            ...activity,
            isDeleted: activity.deleted, // 2
            isCollapsed: true // 3
        })),
    }
}



export default { convertSession };