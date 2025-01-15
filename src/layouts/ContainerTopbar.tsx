import { ReactNode } from "react";


interface Props {
    left?: ReactNode;
    title?: string;
    middle?: ReactNode;
    right?: ReactNode;
}

export default function ContainerTopbar({ left, middle, right, title }: Props) {
    return (
        <div className="flex flex-row mb-1 items-center justify-between">
            <div className="justify-start flex flex-row gap-1 items-center">
                {left}
                {title &&
                    <div >
                        <h1 className="text-xl font-bold">{title}</h1>
                    </div>
                }
            </div>

            <div className="justify-center">
                {middle}
            </div>

            <div className="justify-end">
                {right}
            </div>
        </div>
    );
}