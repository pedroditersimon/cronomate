import { useMemo, useState } from "react";
import Button from "src/shared/components/interactable/Button";
import { Modal } from "src/shared/components/Modal";
import { toDate } from "src/shared/utils/TimeUtils";
import clsx from "clsx";
import { toast } from "sonner";
import { CheckIcon, ClipboardDocumentIcon } from "src/shared/assets/Icons";
import Dropdown from "src/shared/components/interactable/Dropdown";
import { TimeUnit } from "src/shared/types/TimeUnit";
import Checkbox from "src/shared/components/interactable/Checkbox";
import { WorkSession } from "src/features/work-session/types/WorkSession";
import workSessionService from "src/features/work-session/services/workSessionService";
import useUntrackedActivity from "src/features/activity/hooks/useUnrecoredActivity";
import timeTrackService from "src/features/time-track/services/timeTrackService";

interface Props {
    id: string;
    session: WorkSession;
}

export default function WorkSessionTableModal({ id, session }: Props) {
    const [elapsedTimeUnit, setElapsedTimeUnit] = useState<TimeUnit>(TimeUnit.HOUR);
    const [tableCopiedEffect, setTableCopiedEffect] = useState(false);

    // Untracked Activity
    const [includeUnrecordedActivity, setIncludeUnrecordedActivity] = useState(true);
    const sessionTimer = workSessionService.getTimerWithOverrides(session.timer);
    const untrackedActivity = useUntrackedActivity(session.activities, sessionTimer);
    const hasUntrackedActivity = untrackedActivity.tracks.length > 0;

    // Pauses Activity
    const [includePausesActivity, setIncludePausesActivity] = useState(true);
    const hasPausesActivity = session.activities.some(act => act.id === "pauses");


    const rows = useMemo(() => {
        // row is -> | date | title | description | time |

        const _session = includeUnrecordedActivity && hasUntrackedActivity
            ? workSessionService.addActivity(session, untrackedActivity)
            : session; // otherwise, keep the same

        return _session.activities.map(activity => {
            const elapsedTimeMs = timeTrackService.getAllElapsedTime(activity.tracks);
            const elapsedTime = elapsedTimeUnit === TimeUnit.HOUR
                ? elapsedTimeMs / 3.6e+6
                : elapsedTimeMs / 60000;
            // Ceil
            const elapsedTimeTxt = Math.ceil(elapsedTime * 100) / 100;


            // this is a row
            return {
                date: toDate(session.createdTimeStamp).toLocaleString(undefined, { day: "2-digit", month: "2-digit", year: "numeric" }),
                title: activity.title,
                description: activity.description || "",
                elapsedTime: elapsedTimeTxt,
            };
        });

    }, [includeUnrecordedActivity, hasUntrackedActivity, session, untrackedActivity, elapsedTimeUnit]);


    const handleCopyTable = () => {

        setTableCopiedEffect(true);
        // come back to normal icon
        setTimeout(() => setTableCopiedEffect(false), 1000);


        // Convertir la tabla en texto
        const tableText = rows
            .map(row => `${row.date}\t${row.title}\t${row.description}\t${row.elapsedTime}`)
            .join("\n");

        // Copiar el texto al portapapeles
        navigator.clipboard.writeText(tableText).then(() => {
            toast.success("¡La tabla ha sido copiada al portapapeles!");
        });
    };


    return (
        <Modal
            id={id}
            title="Tabla de actividades"
            closeOnClickOut
        >

            <table className="table-fixed"   >
                <thead>
                    <tr className="text-neutral-300 text-left border-b border-neutral-800">
                        <th className="px-2 py-1">Fecha</th>
                        <th className="px-2 py-1 min-w-40">Titulo</th>
                        <th className="px-2 py-1 min-w-40">Descripción</th>
                        <th className="py-1">
                            <Dropdown
                                className="text-neutral-300 border-none"
                                value={elapsedTimeUnit}
                                options={Object.values(TimeUnit)}
                                onOption={(opt) => setElapsedTimeUnit(opt as TimeUnit)}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr
                            className={clsx("text-neutral-400 whitespace-normal break-words break-all",
                                { "border-b border-neutral-800": index < rows.length - 1 }
                            )}
                        >
                            <td className="p-2 max-w-96 text-nowrap">{row.date}</td>
                            <td className="p-2 max-w-96">{row.title}</td>
                            <td className="p-2 max-w-96">{row.description}</td>
                            <td className="p-2 max-w-96 text-nowrap">{row.elapsedTime}</td>
                        </tr>
                    ))}
                </tbody>

            </table>


            {/* bottom */}
            <div className="flex flex-row gap-3 items-center">

                {hasUntrackedActivity &&
                    <Checkbox
                        value={includeUnrecordedActivity}
                        onChange={setIncludeUnrecordedActivity}
                    >
                        Incluir No categorizadas
                    </Checkbox>
                }

                {hasPausesActivity &&
                    <Checkbox
                        value={includePausesActivity}
                        onChange={setIncludePausesActivity}
                    >
                        Incluir Pausas
                    </Checkbox>
                }

                <Button
                    className="ml-auto"
                    onClick={handleCopyTable}
                    icon={tableCopiedEffect
                        ? <CheckIcon className="size-5" />
                        : <ClipboardDocumentIcon className="size-5" />}
                    children="Copiar"
                />
            </div>

        </Modal>
    );
}