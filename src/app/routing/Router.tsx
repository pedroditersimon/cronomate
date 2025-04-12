import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ROUTES } from "src/app/routing/routes";
import AppSettingsPage from "src/features/app-settings/pages/AppSettingsPage";
import { SessionHistoryDetailPage } from "src/features/sessions-history/pages/SessionHistoryDetailPage";
import { SessionsHistoryPage } from "src/features/sessions-history/pages/SessionsHistoryPage";
import SummaryPage from "src/features/summary/pages/SummaryPage";
import TodaySessionPage from "src/features/today-session/pages/TodaySessionPage";
import { NotFoundPage } from "src/shared/pages/NotFoundPage";

const router = createBrowserRouter([
    { path: ROUTES.PRIVATE.TODAY_SESSION, element: <TodaySessionPage /> },
    { path: ROUTES.PRIVATE.HISTORY, element: <SessionsHistoryPage /> },
    { path: ROUTES.PRIVATE.HISTORY_DETAIL, element: <SessionHistoryDetailPage /> },
    { path: ROUTES.PRIVATE.SUMMARY, element: <SummaryPage /> },
    { path: ROUTES.ERROR.NOT_FOUND, element: <NotFoundPage /> },
    { path: ROUTES.PRIVATE.APP_SETTINGS, element: <AppSettingsPage /> },
    // {
    //     path: ROUTES.PRIVATE.DASHBOARD,
    //     element: (
    //         <AuthGuard>
    //             <DashboardPage />
    //         </AuthGuard>
    //     ),
    // },
]);

export const AppRouter = () => <RouterProvider router={router} />;