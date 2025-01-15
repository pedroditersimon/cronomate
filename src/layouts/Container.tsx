import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    className?: string;
}

export default function Container({ children, className }: Props) {
    return (
        <div
            className={`flex flex-col gap-5 max-w-full max-h-full p-6 shadow-lg border-2 rounded-lg border-gray-700 overflow-y-auto box-border bg-[#161616] ${className}`}
        >
            {children}
        </div>
    );
}