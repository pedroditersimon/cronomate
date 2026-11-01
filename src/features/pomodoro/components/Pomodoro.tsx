import clsx from "clsx";
import { DateTime } from "luxon";
import Button from "src/shared/components/interactable/Button";
import { StopIcon, } from "src/assets/Icons";
import { PomodoroState } from "src/features/pomodoro/types/Pomodoro";
import { usePomodoro } from "src/features/pomodoro/hooks/usePomodoro";
import { getChangeStateLabel } from "src/features/pomodoro/utils/getChangeStateLabel";
import { getStateLabel } from "src/features/pomodoro/utils/getStateLabel";

export function Pomodoro() {
    const pomodoro = usePomodoro();

    const overtime = pomodoro.remainingMs < 1000;


    const stateLabel = getStateLabel(pomodoro.state);
    const changeStateLabel = getChangeStateLabel(pomodoro.state);
    const formattedRemaining = overtime ? "00:00"
        : DateTime.fromMillis(pomodoro.remainingMs).toFormat("mm:ss");

    return (
        <div className='flex flex-col gap-5'>
            <div className={clsx("flex flex-col items-center",
                { "text-red-400": overtime }
            )}>
                <span className="text-4xl font-semibold">{formattedRemaining}</span>
                <span>{stateLabel}</span>
            </div>

            <div className="flex flex-row gap-2 justify-center">
                {pomodoro.state !== PomodoroState.STOPPED &&
                    <Button
                        icon={<StopIcon className="w-5 group-hover:text-red-400" />}
                        onClick={pomodoro.stop}
                    />
                }
                <Button
                    children={changeStateLabel}
                    onClick={pomodoro.changeToNextState}
                />
            </div>
        </div>
    );
};
