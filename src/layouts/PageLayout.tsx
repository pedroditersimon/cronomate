import { ReactNode } from "react";
import { BriefcaseIcon } from "../assets/Icons";
import Sidebar from "./Sidebar";


export default function PageLayout({ children }: { children: ReactNode }) {
    return (
        <div className='w-screen h-screen flex flex-row justify-around items-center'>

            <div className='p-5 h-full basis-56'>
                <Sidebar
                    links={[
                        {
                            to: "/",
                            icon: <BriefcaseIcon />,
                            text: "Hoy",
                        },
                        {
                            to: "/1",
                            text: "Sin icono",
                        },
                        {
                            to: "/2",
                            icon: <BriefcaseIcon />,
                        }
                    ]}
                />
            </div>

            <div className='p-5 m-auto'>
                {children}
            </div>
        </div>
    );
}