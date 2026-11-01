import { useDispatch } from "react-redux";
import { setSettings } from "src/features/notes/states/notesSettingsSlice";
import { NotesSettings } from "src/features/notes/types/NotesSettings";
import { useTypedSelector } from "src/shared/hooks/useTypedSelector";

export function useNotesSettings() {
    const dispatch = useDispatch();
    const settings = useTypedSelector(state => state.notesSettings);

    return {
        settings,
        setSettings: (newSettings: NotesSettings) => dispatch(setSettings(newSettings)),
    };
}
