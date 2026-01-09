import { Note as NoteType } from "src/features/notes/types/Note";
import { CheckItem as CheckItemType } from "src/features/notes/types/CheckItem";
import { SettingsIcon } from "src/assets/Icons";
import { PomodoroSettings } from "src/features/pomodoro/components/PomodoroSettings";
import Container from "src/shared/layouts/Container";
import ContainerOverlay from "src/shared/layouts/ContainerOverlay";
import ContainerTopbar from "src/shared/layouts/ContainerTopbar";
import { ClassValue } from "clsx";
import { cn } from "src/shared/utils/cn";
import NoteAndChecklist from "src/features/notes/components/NoteAndChecklist";

interface Props {
    note: NoteType;
    onNoteChange?: (newNote: NoteType) => void;

    checklist: CheckItemType[];
    onChecklistChange?: (items: CheckItemType[]) => void;
    onCheckItemAdd?: (item: CheckItemType) => void;
    onCheckItemDelete?: (id: string) => void;
    onCheckItemUpdate?: (item: CheckItemType) => void;

    className?: ClassValue;
}

export default function NoteAndChecklistPlinth({
    note,
    onNoteChange,

    checklist,
    onChecklistChange,
    onCheckItemAdd,
    onCheckItemDelete,
    onCheckItemUpdate,

    className
}: Props) {

    return (
        <Container className={cn("h-fit", className)}>

            {/* Settings panel */}
            <ContainerOverlay show={false}>
                <PomodoroSettings onClose={() => { }} />
            </ContainerOverlay>

            {/* Topbar */}
            <ContainerTopbar
                className="group"
                title="Notas"

                icon={<SettingsIcon />}
                onIconClick={() => { }}
            />

            <NoteAndChecklist
                note={note}
                onNoteChange={onNoteChange}

                checklist={checklist}
                onChecklistChange={onChecklistChange}
                onCheckItemAdd={onCheckItemAdd}
                onCheckItemDelete={onCheckItemDelete}
                onCheckItemUpdate={onCheckItemUpdate}
            />
        </Container>
    );
}
