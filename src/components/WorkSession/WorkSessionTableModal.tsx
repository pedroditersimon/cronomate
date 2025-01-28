import { useMemo, useState } from "react";
import recordService from "../../services/recordService";
import { WorkSessionType } from "../../types/Activity";
import Button from "../interactable/Button";
import { Modal } from "../Modal";
import { toDate } from "../../utils/TimeUtils";
import clsx from "clsx";
import { toast } from "sonner";
import { ClipboardDocumentIcon } from "../../assets/Icons";
import Dropdown from "../interactable/Dropdown";
import { TimeUnitsEnum, TimeUnitType } from "../../types/types.d.ts";

interface Props {
    id: string;
    session: WorkSessionType;
}

export default function WorkSessionTableModal({ id, session }: Props) {
    const [elapsedTimeUnit, setElapsedTimeUnit] = useState<TimeUnitType>("Horas");

    const rows = useMemo(() => {
        // date -> today
        // title -> activity.title
        // time -> activity elapsed time in text (several formats)

        return session.activities.map(activity => {
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
                description: "...",
                elapsedTime: elapsedTimeTxt,
            };
        });

    }, [session, elapsedTimeUnit]);


    const handleCopyTable = () => {
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

            <Button
                className="ml-auto"
                onClick={handleCopyTable}
                icon={<ClipboardDocumentIcon className="size-5" />}
                children="Copiar"
            />

        </Modal>
    );
}