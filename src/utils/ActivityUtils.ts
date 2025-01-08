import { orderBy } from "lodash";
import { RecordType } from "../types/Activity";
import { getElapsedTime, toDate } from "./TimeUtils";

export function getRecordsElapsedTime(records: Array<RecordType>) {
    return records.reduce((acc, record) => {
        const elapsedTime = getElapsedTime(toDate(record.startTime), toDate(record.endTime));
        return elapsedTime > 0
            ? acc + elapsedTime
            : acc;
    }, 0);
}

// Ordenar los registros por startTime sin mutar el array original
export function orderRecordsByStartTime(records: RecordType[]): RecordType[] {
    return orderBy(records, ['startTime'], ['asc']);
}


export function getUnrecordedPeriods(records: RecordType[], range?: RecordType): RecordType[] {
    // Ordenar los registros por startTime
    const orderedRecords = orderRecordsByStartTime(records);

    const unrecordedPeriods: RecordType[] = [];
    let lastEndTime = range?.startTime || orderedRecords[0]?.endTime || 0; // Usar initialTime si está definido, si no, el primer endTime

    for (let i = 0; i < orderedRecords.length; i++) {
        const currentRecord = orderedRecords[i];

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