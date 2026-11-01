import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotesSettings } from "src/features/notes/types/NotesSettings";
import localSave from "src/shared/services/localSave";

const defaultState: NotesSettings = {
    alertBeforeDueMs: 10 * 60 * 1000,
};

const initialState = {
    ...defaultState,
    ...localSave.load("notesSettings", defaultState),
};

const notesSettingsSlice = createSlice({
    name: "notesSettings",
    initialState,
    reducers: {
        setSettings: (_state, action: PayloadAction<NotesSettings>) => {
            const settings = action.payload;
            localSave.save("notesSettings", settings);
            return settings;
        },
    },
});

export const notesSettingsReducer = notesSettingsSlice.reducer;
export const { setSettings } = notesSettingsSlice.actions;
