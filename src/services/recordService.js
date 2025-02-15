import { orderBy } from "lodash";
import { getElapsedTime, toDate } from "src/utils/TimeUtils";
function add(list, record) {
    // already exists!
    if (list.some(item => item.id === record.id)) {
        throw new Error(`The record with ID ${record.id} already exists.`);
    }
    return [...list, Object.assign({}, record)];
}
function set(list, record) {
    let found = false;
    const updatedList = list.map(item => {
        if (item.id === record.id) {
            found = true;
            return Object.assign({}, record);
        }
        return item;
    });
    if (!found) {
        throw new Error(`The record with ID ${record.id} does not exist.`);
    }
    return updatedList;
}
function stop(record) {
    // record is not running
    if (!record.running)
        return record;
    return Object.assign(Object.assign({}, record), { endTime: toDate().getTime(), running: false });
}
;
function stopAll(list) {
    return list.map(record => stop(record));
}
;
function hasRunning(list) {
    return list.some(record => record.running);
}
function hasTime(record) {
    return record.startTime !== undefined || record.endTime !== undefined;
}
function hasAnyTime(list) {
    return list.some(record => hasTime(record));
}
function getAllElapsedTime(records) {
    return records.reduce((acc, record) => {
        // dont include deleted records
        if (record.deleted)
            return acc;
        const elapsedTime = getElapsedTime(toDate(record.startTime, false), toDate(record.endTime, false));
        return elapsedTime > 0
            ? acc + elapsedTime
            : acc;
    }, 0);
}
// Ordenar los registros por startTime sin mutar el array original
function orderAllByStartTime(records) {
    return orderBy(records, ['startTime'], ['asc']);
}
function getUnrecordedPeriods(records, range) {
    var _a;
    // Ordenar los registros por startTime
    const orderedRecords = orderAllByStartTime(records);
    const unrecordedPeriods = [];
    let lastEndTime = 0;
    const firstRecord = orderedRecords[0];
    // Usar range.startTime si está definido, si no el primer endTime
    if (range === null || range === void 0 ? void 0 : range.startTime) {
        lastEndTime = range.startTime;
    }
    else if ((firstRecord === null || firstRecord === void 0 ? void 0 : firstRecord.endTime) && !firstRecord.deleted) {
        lastEndTime = (_a = firstRecord.endTime) !== null && _a !== void 0 ? _a : 0;
    }
    for (let i = 0; i < orderedRecords.length; i++) {
        const currentRecord = orderedRecords[i];
        if (currentRecord.deleted || !hasTime(currentRecord))
            continue;
        // Ajustar startTime y endTime para que queden dentro del rango inicial y final
        const currentStartTime = currentRecord.startTime || 0;
        const currentEndTime = currentRecord.endTime || 0;
        if ((range === null || range === void 0 ? void 0 : range.endTime) !== undefined && currentStartTime > (range === null || range === void 0 ? void 0 : range.endTime)) {
            break; // Salir si el startTime actual excede finalTime
        }
        // Comparar lastEndTime con el startTime actual, asegurándose de que se considere dentro del rango
        if (lastEndTime < currentStartTime) {
            const gapStart = Math.max(lastEndTime, (range === null || range === void 0 ? void 0 : range.startTime) || 0);
            const gapEnd = Math.min(currentStartTime, (range === null || range === void 0 ? void 0 : range.endTime) || Number.MAX_SAFE_INTEGER);
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
        if ((range === null || range === void 0 ? void 0 : range.endTime) !== undefined) {
            lastEndTime = Math.min(lastEndTime, range === null || range === void 0 ? void 0 : range.endTime);
        }
    }
    // Si aún hay tiempo no registrado después del último registro hasta finalTime
    if ((range === null || range === void 0 ? void 0 : range.endTime) !== undefined && lastEndTime < (range === null || range === void 0 ? void 0 : range.endTime)) {
        unrecordedPeriods.push({
            id: `gap-final`,
            startTime: lastEndTime,
            endTime: range === null || range === void 0 ? void 0 : range.endTime,
        });
    }
    return unrecordedPeriods;
}
function getOnlyDeleted(records) {
    return records.filter(r => r.deleted);
}
export default {
    add, set, stop, stopAll, hasRunning, hasTime, hasAnyTime,
    getAllElapsedTime, orderAllByStartTime, getUnrecordedPeriods, getOnlyDeleted
};
