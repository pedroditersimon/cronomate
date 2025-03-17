import { ButtonHTMLAttributes, PropsWithChildren } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement>, PropsWithChildren {
    onClick?: () => void;
}

export default function Clickable({ onClick, children, ...props }: Props) {
    return (
        <button
            {...props}
            className={`self-center rounded-full size-5 hover:cursor-pointer ${props.className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}