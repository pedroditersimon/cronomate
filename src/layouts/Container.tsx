import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    className?: string;
}

export default function Container({ children, className }: Props) {
    return (
        <div className={`max-w-full h-full p-1 shadow-lg border-2 rounded-lg border-gray-700 transition duration-200 border-opacity-50 hover:border-opacity-100 bg-[#161616] ${className}`}>
            <div className="relative flex h-full flex-col gap-5 p-5 pr-4 overflow-y-auto overflow-x-hidden">
                {children}
            </div>
        </div>
    );
}