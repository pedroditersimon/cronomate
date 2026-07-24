import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Session } from "src/features/session/types/Session";
import { addProjects } from "src/features/projects/states/projectsSlice";
import { useTypedSelector } from "src/shared/hooks/useTypedSelector";
import sessionStorageService from "src/shared/services/sessionStorageService";

export default function useProjects() {
    const dispatch = useDispatch();
    const projects = useTypedSelector(state => state.projects);
    const activities = useTypedSelector(state => state.todaySession.session.activities);

    useEffect(() => {
        sessionStorageService.getItems<Session>("History")
            .then(history => dispatch(addProjects(history.flatMap(session => session.activities.map(activity => activity.project ?? "")))));
    }, [dispatch]);

    useEffect(() => {
        dispatch(addProjects(activities.map(activity => activity.project ?? "")));
    }, [activities, dispatch]);

    return projects;
}
