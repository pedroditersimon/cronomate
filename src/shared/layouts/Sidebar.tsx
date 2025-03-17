import { ReactNode } from "react";
import Container from "./Container";
import clsx from "clsx";
import { LinkType } from "src/types/types";
import LinkBtn from "src/shared/components/interactable/LinkBtn";

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
                    const isSelected = currentLocation.startsWith(link.to);

                    return (
                        <LinkBtn
                            {...link}
                            key={link.to}
                            className={clsx("w-full justify-center rounded-lg hover:bg-gray-700 hover:shadow",
                                { "bg-gray-700 shadow": isSelected }
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
