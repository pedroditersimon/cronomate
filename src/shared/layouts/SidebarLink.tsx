import clsx from "clsx";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import LinkBtn from "src/shared/components/interactable/LinkBtn";
import { Link as LinkType } from "src/shared/types/Link";

interface LinkBtnType extends LinkType {
    text?: string,
    icon?: ReactNode
}

interface SidebarLinkProps {
    link: LinkBtnType
}

export default function SidebarLink({ link }: SidebarLinkProps) {
    const { pathname } = useLocation();

    const isActive = link.to === pathname || (pathname.startsWith(link.to) && link.to !== "/");

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
    );
}