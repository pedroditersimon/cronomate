import { PropsWithChildren } from "react";
import { BriefcaseIcon, GearIcon, InboxStackIcon } from "../assets/Icons";
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
                            to: "/history",
                            icon: <InboxStackIcon />,
                            text: "Historial",
                        },
                        {
                            to: "/1",
                            text: "Sin icono",
                        },
                        {
                            to: "/2",
                            icon: <BriefcaseIcon />,
                        },
                        {
                            to: "/settings",
                            icon: <GearIcon />,
                            text: "Ajustes",
                        },
                    ]}
                />
            </div>

            <div className="flex-grow h-full flex flex-row gap-5 items-center justify-center">
                {children}
            </div>
        </div>
    );
}