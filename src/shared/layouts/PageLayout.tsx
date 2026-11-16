import { PropsWithChildren } from "react";
import { BriefcaseIcon, SettingsIcon, InboxStackIcon, ChartNoAxesCombinedIcon } from "src/assets/Icons";
import Sidebar from "./Sidebar";
import { ROUTES } from "src/app/routing/routes";


export default function PageLayout({ children }: PropsWithChildren) {
    return (
        <div className='flex h-dvh w-full flex-wrap items-center gap-5 overflow-y-auto p-5'>

            <div className='h-full min-w-0 max-w-full shrink-0 basis-60 max-sm:h-auto max-sm:basis-full'>
                <Sidebar
                    linksTop={[
                        {
                            to: ROUTES.PRIVATE.TODAY_SESSION,
                            icon: <BriefcaseIcon />,
                            text: "Hoy",
                        },
                        {
                            to: "/summary",
                            text: "Resumen",
                            icon: <ChartNoAxesCombinedIcon />
                        },
                    ]}

                    linksBottom={[

                        {
                            to: ROUTES.PRIVATE.HISTORY,
                            icon: <InboxStackIcon />,
                            text: "Historial",
                        },
                        {
                            to: "/settings",
                            icon: <SettingsIcon />,
                            text: "Ajustes",
                        },
                    ]}
                />
            </div>

            <main className="flex h-full min-h-0 min-w-0 flex-1 basis-0 flex-wrap content-start items-center justify-center gap-5 overflow-y-auto max-sm:h-auto max-sm:basis-full">
                {children}
            </main>
        </div>
    );
}
