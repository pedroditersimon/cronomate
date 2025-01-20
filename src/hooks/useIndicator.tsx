import { useState } from "react"

export default function useIndicator() {
    const [indicatorState, setIndicatorState] = useState(false);


    return {
        state: indicatorState,
        trigger: () => setIndicatorState(prev => !prev)
    };
}