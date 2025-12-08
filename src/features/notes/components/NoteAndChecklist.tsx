import { Note as NoteType } from "src/features/notes/types/Note";
import { CheckItem as CheckItemType } from "src/features/notes/types/CheckItem";
import CheckItemList from "src/features/notes/components/CheckItemList";
import Note from "src/features/notes/components/Note";
import { ClassValue } from "clsx";


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

export default function NoteAndChecklist({
    note,
    onNoteChange,

    checklist,
    onChecklistChange,
    onCheckItemAdd,
    onCheckItemDelete,
    onCheckItemUpdate,

    className
}: Props) {
    // const { playAudio } = useAudioPlayer({ volume: 0.5 });

    return (<>
        <Note
            note={note}
            onChange={onNoteChange}
            placeholder="Escribe tus notas aquí..."
            autoResize={false}
        />
        <CheckItemList
            checklist={checklist}
            onChange={onChecklistChange}
            onAdd={onCheckItemAdd}
            onDelete={onCheckItemDelete}
            onUpdate={onCheckItemUpdate}
        />
    </>);
}
