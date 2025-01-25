import { HTMLProps, ReactNode } from "react";

interface Props extends HTMLProps<HTMLDivElement> {
    children: ReactNode;
}

export default function Container({ children, ...props }: Props) {
    return (
        <div
            {...props}
            className={`relative max-w-full h-full p-1 shadow-lg border-2 rounded-lg border-gray-700 transition duration-200 border-opacity-50 hover:border-opacity-100 bg-[#161616] ${props.className}`}
        >
            <div className="flex h-full flex-col gap-5 p-5 pr-4 overflow-y-scroll overflow-x-hidden">
                {children}
            </div>
        </div>
    );
}