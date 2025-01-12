import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    className?: string;
}

export default function Container({ children, className }: Props) {
    return (
        <div className={`flex flex-col gap-5 w-full h-full p-6 shadow-lg border-2 rounded-lg border-solid border-gray-700 bg-[#161616] ${className}`}>
            {children}
        </div>
    );
}