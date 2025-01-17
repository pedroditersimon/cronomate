import clsx from "clsx";
import Container from "../layouts/Container";
import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
    show?: boolean;
}

export default function ContainerOverlay({ children, show }: Props) {
    return (
        <Container
            className={clsx("!absolute left-0 top-0 size-full z-[1] border-none",
                { "hidden": !show }
            )}
        >
            {children}
        </Container>
    );
}