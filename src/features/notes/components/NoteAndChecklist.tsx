import { Note as NoteType } from "src/features/notes/types/Note";
import { CheckItem as CheckItemType } from "src/features/notes/types/CheckItem";
import CheckItemList from "src/features/notes/components/CheckItemList";
import Note from "src/features/notes/components/Note";
import { ClassValue } from "clsx";


interface Props {
    note: NoteType;
    onNoteChange?: (newNote: NoteType) => void;

    checklist: CheckItemType[];
    currentTime?: number;
    onChecklistChange?: (items: CheckItemType[]) => void;
    onCheckItemAdd?: (items: CheckItemType[]) => void;
    onCheckItemDelete?: (id: string) => void;
    onCheckItemUpdate?: (item: CheckItemType) => void;
    onCheckItemReorder?: (itemId: string, targetItemId?: string) => void;

    className?: ClassValue;
}

export default function NoteAndChecklist({
    note,
    onNoteChange,

    checklist,
    currentTime,
    onChecklistChange,
    onCheckItemAdd,
    onCheckItemDelete,
    onCheckItemUpdate,
    onCheckItemReorder,

    className
}: Props) {
    // const { playAudio } = useAudioPlayer({ volume: 0.5 });

    return (<>
        <Note
            key={note.id}
            note={note}
            onChange={onNoteChange}
            placeholder="Escribe tus notas aquí..."
        />
        <CheckItemList
            checklist={checklist}
            currentTime={currentTime}
            onChange={onChecklistChange}
            onAdd={onCheckItemAdd}
            onDelete={onCheckItemDelete}
            onUpdate={onCheckItemUpdate}
            onReorder={onCheckItemReorder}
        />
    </>);
}
