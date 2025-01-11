import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    href: string;
    target?: string;
    onClick?: () => void;
    className?: string;
}

export default function ClickableLink({ children, href, target, onClick, className }: Props) {
    return (
        <a
            className={`flex flex-row gap-1 self-center rounded-full p-0.5 px-2 hover:cursor-pointer ${className}`}
            onClick={onClick}
            href={href}
            target={target}
        >
            {children}
        </a>
    );
}