import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
}

export default function Clickable({ children, onClick, className }: Props) {
    return (
        <div
            className={`self-center rounded-full p-0.5 size-6 hover:cursor-pointer ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}