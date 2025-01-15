import { ReactNode } from "react";
import LinkBtn from "../components/LinkBtn";
import Container from "./Container";
import clsx from "clsx";
import { LinkType } from "../types/types";

interface LinkBtnType extends LinkType {
    text?: string,
    icon?: ReactNode
}
interface Props {
    links: Array<LinkBtnType>
}

export default function Sidebar({ links }: Props) {
    const currentLocation = window.location.pathname;

    return (
        <Container className="h-full">
            {
                links.map(link => {
                    const isSelected = link.to === currentLocation;

                    return (
                        <LinkBtn
                            {...link}
                            key={link.to}
                            className={clsx("w-full justify-center rounded-lg hover:bg-gray-700",
                                { "bg-gray-700": isSelected }
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
        </Container >
    );
}
