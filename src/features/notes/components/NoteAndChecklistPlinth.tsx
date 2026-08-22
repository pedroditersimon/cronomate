import { Note as NoteType } from "src/features/notes/types/Note";
import { CheckItem as CheckItemType } from "src/features/notes/types/CheckItem";
import { SettingsIcon } from "src/assets/Icons";
import { NotesSettings } from "src/features/notes/components/NotesSettings";
import Container from "src/shared/layouts/Container";
import ContainerOverlay from "src/shared/layouts/ContainerOverlay";
import ContainerTopbar from "src/shared/layouts/ContainerTopbar";
import { ClassValue } from "clsx";
import { cn } from "src/shared/utils/cn";
import NoteAndChecklist from "src/features/notes/components/NoteAndChecklist";
import { useState } from "react";

interface Props {
    note: NoteType;
    onNoteChange?: (newNote: NoteType) => void;

    checklist: CheckItemType[];
    currentTime?: number;
    alertWindowMs?: number;
    onChecklistChange?: (items: CheckItemType[]) => void;
    onCheckItemAdd?: (items: CheckItemType[]) => void;
    onCheckItemDelete?: (id: string) => void;
    onCheckItemUpdate?: (item: CheckItemType) => void;
    onCheckItemReorder?: (itemId: string, targetItemId?: string) => void;

    className?: ClassValue;
}

export default function NoteAndChecklistPlinth({
    note,
    onNoteChange,

    checklist,
    currentTime,
    alertWindowMs,
    onChecklistChange,
    onCheckItemAdd,
    onCheckItemDelete,
    onCheckItemUpdate,
    onCheckItemReorder,

    className,
}: Props) {
    const [showSettings, setShowSettings] = useState(false);

    return (
        <Container className={cn("h-fit", className)}>

            {/* Settings panel */}
            <ContainerOverlay show={showSettings}>
                <NotesSettings onClose={() => setShowSettings(false)} />
            </ContainerOverlay>

            {/* Topbar */}
            <ContainerTopbar
                className="group"
                title="Notas"

                icon={<SettingsIcon />}
                onIconClick={() => setShowSettings(true)}
            />

            <NoteAndChecklist
                note={note}
                onNoteChange={onNoteChange}

                checklist={checklist}
                currentTime={currentTime}
                alertWindowMs={alertWindowMs}
                onChecklistChange={onChecklistChange}
                onCheckItemAdd={onCheckItemAdd}
                onCheckItemDelete={onCheckItemDelete}
                onCheckItemUpdate={onCheckItemUpdate}
                onCheckItemReorder={onCheckItemReorder}
            />
        </Container>
    );
}
