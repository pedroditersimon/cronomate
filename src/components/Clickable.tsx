import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    onClick?: () => void;
}

export default function Clickable({ children, onClick }: Props) {
    return (
        <div
            className="self-center rounded-full p-0.5 size-6 hover:cursor-pointer"
            onClick={onClick}
        >
            {children}
        </div>
    );
}