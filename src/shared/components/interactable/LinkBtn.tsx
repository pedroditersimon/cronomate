import { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "src/shared/types/Link";


interface Props extends Link {
    className?: string;
    onClick?: () => void;
    children: ReactNode;
}

export default function LinkBtn({ className, to, target, onClick, children }: Props) {
    return (
        <RouterLink
            className={`flex flex-row gap-1 self-center rounded-lg p-0.5 px-2 hover:cursor-pointer hover:bg-gray-700 ${className}`}
            onClick={onClick}
            to={to}
            target={target}
            children={children}
        />
    );
}