import { ReactNode } from "react";
import ClickableLink from "../components/ClickableLink";
import Container from "./Container";
import clsx from "clsx";

interface Props {
    links: Array<{ href: string, text?: string, icon?: ReactNode }>
}

export default function Sidebar({ links }: Props) {
    const currentLocation = window.location.pathname;

    return (
        <Container className="w-40 rounded-xl">
            {
                links.map(link => {
                    const isSelected = link.href === currentLocation;

                    return (
                        <ClickableLink href={link.href}
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
                        </ClickableLink>
                    )
                })
            }
        </Container >
    );
}
