import { createSlice, PayloadAction } from "@reduxjs/toolkit";

function mergeProjects(current: string[], incoming: string[]) {
    const projects = [...current];
    incoming.forEach(project => {
        const normalized = project.trim();
        if (normalized && !projects.some(item => item.toLocaleLowerCase() === normalized.toLocaleLowerCase()))
            projects.push(normalized);
    });
    return projects.sort((a, b) => a.localeCompare(b));
}

const projectsSlice = createSlice({
    name: "projects",
    initialState: [] as string[],
    reducers: {
        addProjects: (state, action: PayloadAction<string[]>) => mergeProjects(state, action.payload),
    }
});

export const { addProjects } = projectsSlice.actions;
export const projectsReducer = projectsSlice.reducer;
