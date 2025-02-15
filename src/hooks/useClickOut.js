import { useEffect, useState } from "react";
export default function useClickOut(onClickOut, enabled = true) {
    const [isMouseOut, setIsMouseOut] = useState(false);
    useEffect(() => {
        // feature not enabled
        if (!enabled)
            return;
        const onMouseDown = () => {
            if (isMouseOut)
                onClickOut();
        };
        addEventListener("mousedown", onMouseDown);
        return () => removeEventListener("mousedown", onMouseDown); // clean up
    }, [enabled, isMouseOut, onClickOut]);
    const handleMouseEnter = () => {
        setIsMouseOut(false);
    };
    const handleMouseLeave = () => {
        setIsMouseOut(true);
    };
    return {
        setIsMouseOut,
        handleMouseEnter,
        handleMouseLeave
    };
}
