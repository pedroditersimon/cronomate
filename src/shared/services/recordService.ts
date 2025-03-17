import { orderBy } from "lodash";
import { Record } from "src/types/Activity";
import { getElapsedTime, toDate } from "src/shared/utils/TimeUtils";

function add(list: Array<Record>, record: Record): Array<Record> {
    // already exists!
    if (list.some(item => item.id === record.id)) {
        throw new Error(`The record with ID ${record.id} already exists.`);
    }

    return [...list, { ...record }];
}


function set(list: Array<Record>, record: Record): Array<Record> {
    let found = false;

    const updatedList = list.map(item => {
        if (item.id === record.id) {
            found = true;
            return { ...record };
        }
        return item;
    });

    if (!found) {
        throw new Error(`The record with ID ${record.id} does not exist.`);
    }

    return updatedList;
}



function stop(record: Record): Record {
    // record is not running
    if (!record.running)
        return record;

    return {
        ...record,
        endTime: toDate().getTime(), // now
        running: false,
    };
};

function stopAll(list: Array<Record>): Array<Record> {
    return list.map(record => stop(record));
};

function hasRunning(list: Array<Record>): boolean {
    return list.some(record => record.running);
}


function hasTime(record: Record): boolean {
    return record.startTime !== undefined || record.endTime !== undefined;
}

function hasAnyTime(list: Array<Record>): boolean {
    return list.some(record => hasTime(record));
}


function getAllElapsedTime(records: Array<Record>): number {
    return records.reduce((acc, record) => {
        // dont include deleted records
        if (record.deleted) return acc;

        const elapsedTime = getElapsedTime(toDate(record.startTime, false), toDate(record.endTime, false));
        return elapsedTime > 0
            ? acc + elapsedTime
            : acc;
    }, 0);
}

// Ordenar los registros por startTime sin mutar el array original
function orderAllByStartTime(records: Array<Record>): Array<Record> {
    return orderBy(records, ['startTime'], ['asc']);
}


function getUnrecordedPeriods(records: Array<Record>, range?: Record): Array<Record> {
    // Ordenar los registros por startTime
    const orderedRecords = orderAllByStartTime(records);

    const unrecordedPeriods: Array<Record> = [];

    let lastEndTime = 0;
    const firstRecord = orderedRecords[0];

    // Usar range.startTime si está definido, si no el primer endTime
    if (range?.startTime) {
        lastEndTime = range.startTime;
    } else if (firstRecord?.endTime && !firstRecord.deleted) {
        lastEndTime = firstRecord.endTime ?? 0;
    }



    for (let i = 0; i < orderedRecords.length; i++) {
        const currentRecord = orderedRecords[i];
        if (currentRecord.deleted || !hasTime(currentRecord)) continue;

        // Ajustar startTime y endTime para que queden dentro del rango inicial y final
        const currentStartTime = currentRecord.startTime || 0;
        const currentEndTime = currentRecord.endTime || 0;

        if (range?.endTime !== undefined && currentStartTime > range?.endTime) {
            break; // Salir si el startTime actual excede finalTime
        }

        // Comparar lastEndTime con el startTime actual, asegurándose de que se considere dentro del rango
        if (lastEndTime < currentStartTime) {
            const gapStart = Math.max(lastEndTime, range?.startTime || 0);
            const gapEnd = Math.min(currentStartTime, range?.endTime || Number.MAX_SAFE_INTEGER);

            if (gapStart < gapEnd) {
                unrecordedPeriods.push({
                    id: `gap-${i}`,
                    startTime: gapStart,
                    endTime: gapEnd,
                });
            }
        }

        // Actualizar lastEndTime, considerando el rango final
        lastEndTime = Math.max(lastEndTime, currentEndTime);
        if (range?.endTime !== undefined) {
            lastEndTime = Math.min(lastEndTime, range?.endTime);
        }
    }

    // Si aún hay tiempo no registrado después del último registro hasta finalTime
    if (range?.endTime !== undefined && lastEndTime < range?.endTime) {
        unrecordedPeriods.push({
            id: `gap-final`,
            startTime: lastEndTime,
            endTime: range?.endTime,
        });
    }

    return unrecordedPeriods;
}

function getOnlyDeleted(records: Array<Record>): Array<Record> {
    return records.filter(r => r.deleted);
}


export default {
    add, set, stop, stopAll, hasRunning, hasTime, hasAnyTime,
    getAllElapsedTime, orderAllByStartTime, getUnrecordedPeriods, getOnlyDeleted
};