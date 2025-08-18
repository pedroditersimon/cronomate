import Button from "src/shared/components/interactable/Button";
import { Modal } from "src/shared/components/Modal";
import clsx from "clsx";
import { CheckIcon, ClipboardDocumentIcon } from "src/assets/Icons";
import Dropdown from "src/shared/components/interactable/Dropdown";
import { TimeUnit } from "src/shared/types/TimeUnit";
import Checkbox from "src/shared/components/interactable/Checkbox";
import { SessionTableModalRow } from "src/features/session-table-modal/types/SessionTableModal";


interface Props {
    id?: string;
    rows: SessionTableModalRow[];
    disableCopyBtn: boolean;
    handleCopyTable: () => void;
    includeDateCol: boolean;
    setIncludeDateCol: (value: boolean) => void;
    elapsedTimeUnit: TimeUnit;
    setElapsedTimeUnit: (value: TimeUnit) => void;
    includeUnrecordedActivity: boolean;
    setIncludeUnrecordedActivity: (value: boolean) => void;
    includePausesActivity: boolean;
    setIncludePausesActivity: (value: boolean) => void;
    hasUntrackedActivity: boolean;
    hasPausesActivity: boolean;
    tableCopiedEffect: boolean;
}


export default function SessionTableModalPresenter({
    id = "session-table-modal",
    rows,
    disableCopyBtn, handleCopyTable,
    includeDateCol, setIncludeDateCol,
    elapsedTimeUnit, setElapsedTimeUnit,
    includeUnrecordedActivity, setIncludeUnrecordedActivity,
    includePausesActivity, setIncludePausesActivity,
    hasUntrackedActivity,
    hasPausesActivity,
    tableCopiedEffect
}: Props) {

    return (
        <Modal
            id={id}
            title="Tabla de actividades"
            closeOnClickOut
        >
            <div className="size-full mr-4 overflow-y-auto overflow-x-hidden _text-sm">
                <table className="w-full">
                    <thead>
                        <tr className="text-neutral-300 text-left border-b border-neutral-800">
                            {includeDateCol && (
                                <th className="px-2 py-1">Fecha</th>
                            )}
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
                                key={row.key}
                                className={clsx("text-neutral-400 whitespace-normal break-words break-all",
                                    { "border-b border-neutral-800": index < rows.length - 1 }
                                )}
                            >
                                {includeDateCol && (
                                    <td className="p-2 max-w-96 text-nowrap">{row.date}</td>
                                )}
                                <td className="p-2 max-w-96">{row.title}</td>
                                <td className="p-2 max-w-96">{row.description}</td>
                                <td className="p-2 max-w-96 text-nowrap">{row.elapsedTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* bottom */}
            <div className="flex flex-row gap-3 items-center">

                <Checkbox
                    value={includeDateCol}
                    onChange={setIncludeDateCol}
                >
                    Incluir Fecha
                </Checkbox>

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
                    disabled={disableCopyBtn}
                    children="Copiar"
                />
            </div>

        </Modal>
    );
}