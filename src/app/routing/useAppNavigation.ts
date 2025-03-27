import { useNavigate } from "react-router";
import { ROUTES } from "src/app/routing/routes";

export default function useAppNavigation() {
    const navigate = useNavigate();

    return {
        goToTodaySession: () => navigate(ROUTES.PRIVATE.TODAY_SESSION),
        goToHistory: () => navigate(ROUTES.PRIVATE.HISTORY),
        goToHistorySession: (sessionId: string) =>
            navigate(`${ROUTES.PRIVATE.HISTORY}/${sessionId}`),
    };
}