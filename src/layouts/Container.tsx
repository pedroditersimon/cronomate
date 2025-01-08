import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    className?: string;
}

export default function Container({ children, className }: Props) {
    return (
        <div className={`flex flex-col gap-5 w-fit h-fit p-4 border rounded-lg border-solid border-gray-600 bg-[#161616] ${className}`}>
            {children}
        </div>
    );
}