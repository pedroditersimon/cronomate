import { CheckItem as CheckItemType } from "src/features/notes/types/CheckItem";
import CheckItem from "src/features/notes/components/CheckItem";
import { useState } from "react";
import { generateId } from "src/shared/utils/generateId";
import { DateTime } from "luxon";

interface Props {
    checklist: CheckItemType[];
    onChange?: (items: CheckItemType[]) => void;

    onAdd?: (item: CheckItemType) => void;
    onDelete?: (id: string) => void;
    onUpdate?: (item: CheckItemType) => void;
}

const defaultGhostItem: CheckItemType = {
    id: 'ghost',
    content: '',
    isDone: false,
    due: undefined,
    createdAt: DateTime.now().toFormat("dd-MM-yyyy HH:mm:ss"),
};

export default function CheckItemList({
    checklist,
    onChange,
    onAdd,
    onDelete,
    onUpdate
}: Props) {

    const [ghost, setGhost] = useState<CheckItemType>(defaultGhostItem);

    const updateItem = (newItem: CheckItemType) => {
        if (onUpdate) onUpdate(newItem);
        if (onChange) onChange(checklist.map(i => i.id === newItem.id ? newItem : i));
    }

    const deleteItem = (id: string) => {
        if (onDelete) onDelete(id);
        if (onChange) onChange(checklist.filter(i => i.id !== id));
    }

    const addGhostToList = () => {
        if (ghost.content.trim() === '') return;

        const newItem: CheckItemType = { ...ghost, id: generateId() };
        if (onAdd) onAdd(newItem);
        if (onChange) onChange([...checklist, newItem]);

        // reset
        setGhost(defaultGhostItem);
    }

    return (
        <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold text-neutral-200">Checklist</h1>

            <div className="flex flex-col gap-1 overflow-y-auto">
                {
                    checklist.map(item => (
                        <CheckItem
                            key={item.id}
                            item={item}
                            onChange={updateItem}
                            onDelete={() => deleteItem(item.id)}
                        />
                    ))
                }
                <CheckItem
                    key={ghost.id}
                    item={ghost}
                    onChange={setGhost}
                    onEnterPressed={addGhostToList}
                    canDelete={false}
                    canToggle={false}
                    placeholder="Agregar item..."
                />
            </div>
        </div>
    );
}