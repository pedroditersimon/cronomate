import { CircleIcon, PlayIcon } from "../../assets/Icons";
import ActivityEntry from "./ActivityEntry";

export default function ActivityPlaceholder() {
    const name = "Crear";
    const start = undefined;
    const end = undefined;

    return (
        <div className="flex flex-col gap-1 min-w-80">
            <div className="flex flex-row gap-1">
                <CircleIcon />
                <div
                    className="flex flex-row gap-1 w-full px-1
                           border-dotted rounded-lg border-2 border-gray-700"
                >
                    <span>{name}</span>
                    <span className="ml-auto"></span>
                    <PlayIcon />
                </div>
            </div>

            <div className="flex flex-col gap-1 ml-10">
                {/*<ActivityEntry start={start} end={end} />*/}
            </div>
        </div>
    );
}