import { ReactNode } from "react";
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
    const basePath = "/" + pathname.slice(1).split('/')[0];

    return (
        <Container className="h-full min-w-full">
            <div className="flex flex-col gap-1">
                {links.map(link => {
                    const isActive = basePath === link.to;

                    return (
                        <LinkBtn
                            {...link}
                            key={link.to}
                            className={clsx("group h-7 w-full justify-center rounded-lg hover:text-white hover:bg-gray-700 hover:shadow",
                                {
                                    "bg-gray-700 shadow": isActive,
                                    "text-gray-400": !isActive
                                }
                            )}
                        >
                            {link.icon &&
                                <div
                                    className={clsx("h-full w-5 group-hover:w-6 flex justify-center items-center",
                                        {
                                            "m-auto": !link.text,
                                            "w-6": isActive
                                        }
                                    )}
                                >
                                    {link.icon}
                                </div>
                            }
                            {link.text && (
                                <span
                                    className={clsx("mr-auto my-auto group-hover:text-base",
                                        {
                                            "text-base": isActive,
                                            "text-sm": !isActive
                                        }
                                    )}
                                    children={link.text}
                                />
                            )}
                        </LinkBtn>
                    )
                })}
            </div>

        </Container >
    );
}
