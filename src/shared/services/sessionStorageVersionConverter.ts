import { DateTime } from "luxon";
import { Activity } from "src/features/activity/types/Activity";
import { CheckItem } from "src/features/notes/types/CheckItem";
import sessionService from "src/features/session/services/sessionService";

// [!] DONT use spread operator here

type SchemaMigration = {
    fromVersion: string;
    toVersion: string;
    convert: (session: any) => any;
};

// Add an entry only when the persisted Session schema changes.
const schemaMigrations: SchemaMigration[] = [
    { fromVersion: '0.0.0', toVersion: '0.1.0', convert: v0_0_0_to_v0_1_0 },
    { fromVersion: '0.1.0', toVersion: '0.3.0', convert: v0_2_0_to_v0_3_0 },
    { fromVersion: '0.3.0', toVersion: '0.4.0', convert: v0_3_0_to_v0_4_0 },
    { fromVersion: '0.4.0', toVersion: '0.6.0', convert: v0_5_0_to_v0_6_0 },
];

function compareVersions(first: string, second: string): number {
    const firstParts = first.split('.').map(Number);
    const secondParts = second.split('.').map(Number);

    for (let index = 0; index < 3; index++) {
        const difference = (firstParts[index] ?? 0) - (secondParts[index] ?? 0);
        if (difference !== 0) return difference;
    }

    return 0;
}

function convertSession(session: any, fromVersion: string, targetVersion: string): any {
    let convertedSession = session;
    let currentVersion = fromVersion;

    while (compareVersions(currentVersion, targetVersion) < 0) {
        const migration = schemaMigrations.find(({
            fromVersion: migrationFromVersion,
            toVersion: migrationToVersion,
        }) => (
            compareVersions(migrationFromVersion, currentVersion) <= 0
            && compareVersions(currentVersion, migrationToVersion) < 0
            && compareVersions(migrationToVersion, targetVersion) <= 0
        ));

        // Unknown version or a future schema: preserve the saved session.
        if (!migration) {
            const hasUnreachableMigration = schemaMigrations.some(({ fromVersion, toVersion }) => (
                compareVersions(currentVersion, fromVersion) < 0
                && compareVersions(toVersion, targetVersion) <= 0
            ));

            if (hasUnreachableMigration) {
                console.warn(`Cant convert session from v${fromVersion} to v${targetVersion}`, session);
            }

            return convertedSession;
        }

        convertedSession = migration.convert(convertedSession);
        currentVersion = migration.toVersion;
    }

    return convertedSession;
}


// Convert session from v0.5.0 to v0.6.0
function v0_5_0_to_v0_6_0(session: any) {
    // Changes:
    // 1. Added note to session
    // 2. Added checklist to session

    return {
        id: session.id,
        activities: session.activities,
        createdTimestamp: session.createdTimestamp,
        durationLimit: session.durationLimit,
        inactivityThresholdMs: session.inactivityThresholdMs,
        note: {
            id: `note-${session.id}`,
            content: '',
            createdAt: DateTime.fromMillis(session.createdTimestamp).toFormat('dd/MM/yyyy HH:mm'),
        },
        checklist: [] as CheckItem[],
    }
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
