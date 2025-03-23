import { ReactNode, useEffect } from "react";
import Container from "./Container";
import clsx from "clsx";
import { Link as LinkType } from "src/shared/types/Link";
import LinkBtn from "src/shared/components/interactable/LinkBtn";
import { useLocation } from "react-router";

interface LinkBtnType extends LinkType {
    text?: string,
    icon?: ReactNode
}
interface Props {
    links: Array<LinkBtnType>
}

export default function Sidebar({ links }: Props) {
    const { pathname } = useLocation();

    // Ejemplo: '/history/1' → '/history'
    // Ejemplo: '/' → '/'
    const basePath = pathname.split('/').slice(0, 3).join('/');


    return (
        <Container className="h-full">
            <div className="flex flex-col gap-2">
                {
                    links.map(link => {
                        const isActive = basePath === link.to;
                        console.log(basePath, link.to);
                        return (
                            <LinkBtn
                                {...link}
                                key={link.to}
                                className={clsx("w-full justify-center rounded-lg hover:text-white hover:bg-gray-700 hover:shadow",
                                    {
                                        "bg-gray-700 shadow": isActive,
                                        "text-gray-400": !isActive
                                    }
                                )}
                            >
                                {link.icon &&
                                    <div
                                        className={clsx("size-6",
                                            { "m-auto": !link.text }
                                        )}
                                    >
                                        {link.icon}
                                    </div>
                                }
                                {link.text && <span className="mr-auto" >{link.text}</span>}
                            </LinkBtn>
                        )
                    })
                }
            </div>

        </Container >
    );
}
