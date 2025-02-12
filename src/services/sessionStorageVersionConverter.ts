import { WorkSessionType } from "../types/Activity";


function convertSession(session: any, fromVersion: string, toVersion: string) {
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

    return convertedSession.value;
}

function convertSessionToNext(session: WorkSessionType, fromVersion: string) {
    // 0.0.0 -> 0.1.0
    if (fromVersion === '0.0.0') {
        return {
            value: convertSessionFromV0_0_0ToV0_1_0(session),
            newVersion: '0.1.0'
        };
    }

    // keep same
    return {
        value: session,
        newVersion: fromVersion
    };
}


// Convert session from version 0.0.0 to 0.1.0
function convertSessionFromV0_0_0ToV0_1_0(session: any) {
    // Changes on session:
    // 1. maxDurationMinutes is moved to timer.maxDurationMinutes
    // 2. activities.deleted is renamed to activities.isDeleted
    // 3. activities.isCollapsed is added and set to true

    // [!] Guard: Ensure the session is from the correct version by checking it
    if (session.maxDurationMinutes === null) return session;

    return {
        ...session,
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