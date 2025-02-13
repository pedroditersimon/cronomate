import { useMemo, useState } from "react";
import recordService from "../../services/recordService";
import { WorkSessionType } from "../../types/Activity";
import Button from "../interactable/Button";
import { Modal } from "../Modal";
import { toDate } from "../../utils/TimeUtils";
import clsx from "clsx";
import { toast } from "sonner";
import { CheckIcon, ClipboardDocumentIcon } from "../../assets/Icons";
import Dropdown from "../interactable/Dropdown";
import { TimeUnitsEnum, type TimeUnitType } from "../../types/types.ts";
import useUnrecordedActivity from "../../hooks/useUnrecoredActivity.ts";
import workSessionService from "../../services/workSessionService.ts";
import Checkbox from "../interactable/Checkbox.tsx";

interface Props {
    id: string;
    session: WorkSessionType;
}

export default function WorkSessionTableModal({ id, session }: Props) {
    const [elapsedTimeUnit, setElapsedTimeUnit] = useState<TimeUnitType>("Horas");
    const [tableCopiedEffect, setTableCopiedEffect] = useState(false);

    // Unrecorded Activity
    const [includeUnrecordedActivity, setIncludeUnrecordedActivity] = useState(true);
    const sessionTimer = workSessionService.getTimerWithOverrides(session.timer);
    const unrecordedActivity = useUnrecordedActivity(session.activities, sessionTimer);
    const hasUnrecoredActivity = unrecordedActivity.records.length > 0;

    // Pauses Activity
    const [includePausesActivity, setIncludePausesActivity] = useState(true);
    const hasPausesActivity = session.activities.some(act => act.id === "pauses");


    const rows = useMemo(() => {
        // row is -> | date | title | description | time |

        const _session = includeUnrecordedActivity && hasUnrecoredActivity
            ? workSessionService.addActivity(session, unrecordedActivity)
            : session; // otherwise, keep the same

        return _session.activities.map(activity => {
            const elapsedTimeMs = recordService.getAllElapsedTime(activity.records);
            const elapsedTime = elapsedTimeUnit === "Horas"
                ? elapsedTimeMs / 3.6e+6
                : elapsedTimeMs / 60000;
            // Ceil
            const elapsedTimeTxt = Math.ceil(elapsedTime * 100) / 100;


            // this is a row
            return {
                date: toDate(session.createdTimeStamp).toLocaleString(undefined, { day: "2-digit", month: "2-digit", year: "numeric" }),
                title: activity.title,
                description: activity.description,
                elapsedTime: elapsedTimeTxt,
            };
        });

    }, [includeUnrecordedActivity, hasUnrecoredActivity, session, unrecordedActivity, elapsedTimeUnit]);


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

                <tr className="text-neutral-300 text-left border-b border-neutral-800">
                    <th className="px-2 py-1">Fecha</th>
                    <th className="px-2 py-1 min-w-40">Titulo</th>
                    <th className="px-2 py-1 min-w-40">Descripción</th>
                    <th className="py-1">
                        <Dropdown
                            className="text-neutral-300 border-none"
                            value={elapsedTimeUnit}
                            options={Object.values(TimeUnitsEnum)}
                            onOption={(opt) => setElapsedTimeUnit(opt as TimeUnitType)}
                        />
                    </th>
                </tr>

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
            </table>


            {/* bottom */}
            <div className="flex flex-row gap-3 items-center">

                {hasUnrecoredActivity &&
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