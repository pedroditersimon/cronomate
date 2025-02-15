import clsx from "clsx";
import Container from "src/layouts/Container";
import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
    show?: boolean;
}

export default function ContainerOverlay({ children, show }: Props) {
    return (
        <Container
            className={clsx("!absolute flex flex-col gap-5 p-1 left-0 top-0 bottom-0 size-full z-[1] bg-[#161616] border-none",
                { "hidden": !show }
            )}
        >
            {children}
        </Container>
    );
}