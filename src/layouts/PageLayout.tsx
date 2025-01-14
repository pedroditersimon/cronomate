import { ReactNode } from "react";
import { BriefcaseIcon, GearIcon, InboxStackIcon } from "../assets/Icons";
import Sidebar from "./Sidebar";


export default function PageLayout({ children }: { children: ReactNode }) {
    return (
        <div className='w-screen h-screen flex flex-row justify-around items-center'>

            <div className='p-5 h-full basis-60'>
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

            <div className='p-5 m-auto'>
                {children}
            </div>
        </div>
    );
}