import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { LinkType } from "../types/types";

interface Props extends LinkType {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
}

export default function LinkBtn({ children, to, target, onClick, className }: Props) {
    return (
        <Link
            className={`flex flex-row gap-1 self-center rounded-lg p-0.5 px-2 hover:cursor-pointer hover:bg-gray-700 ${className}`}
            onClick={onClick}
            to={to}
            target={target}
            children={children}
        />
    );
}