import { Activity } from "src/features/activity/types/Activity";
import { CheckItem } from "src/features/notes/types/CheckItem";
import { Note } from "src/features/notes/types/Note";

export interface Session {
    id: string;
    createdTimestamp: number;
    activities: Array<Activity>;

    durationLimit: {
        /** 
         * Start time (HH:mm format) - Do not use directly. Only for millis calculation 
         * @see millis 
         */
        start: string | null;

        /** 
         * End time (HH:mm format) - Do not use directly. Only for millis calculation 
         * @see millis 
         */
        end: string | null;

        /** Calculated max duration in milliseconds (main usage property) */
        millis: number | null;
    }

    inactivityThresholdMs: number | null;

    note: Note;
    checklist: CheckItem[];
}

