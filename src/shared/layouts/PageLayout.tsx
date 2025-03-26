import { PropsWithChildren } from "react";
import { BriefcaseIcon, SettingsIcon, InboxStackIcon, ChartPieIcon, CalendarIcon, PresentationChartLineIcon, LineChartFillIcon, ChartNoAxesCombinedIcon, ChartLineIcon } from "src/shared/assets/Icons";
import Sidebar from "./Sidebar";


export default function PageLayout({ children }: PropsWithChildren) {
    return (
        <div className='p-5 w-screen h-screen flex flex-row gap-5 items-center'>

            <div className='h-full w-60'>
                <Sidebar
                    links={[
                        {
                            to: "/",
                            icon: <BriefcaseIcon />,
                            text: "Hoy",
                        },
                        {
                            to: "/calendar",
                            text: "Calendario",
                            icon: <CalendarIcon />
                        },
                        {
                            to: "/performance",
                            text: "Rendimiento",
                            icon: <ChartNoAxesCombinedIcon />
                        },
                        {
                            to: "/history",
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

            <div className="flex-grow flex flex-row h-full gap-5 items-center justify-center">
                {children}
            </div>
        </div>
    );
}