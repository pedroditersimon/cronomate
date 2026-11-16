import type { RootState } from "src/app/states/redux/store";
import type { Session } from "src/features/session/types/Session";

export interface Backup {
    sessions: Session[];
    settings: Pick<RootState, "appSettings" | "todaySessionSettings" | "pomodoroSettings" | "notesSettings" | "projects">;
}
