export interface LinkType {
    to: string;
    target?: string;
}


export enum TimeUnitsEnum {
    Horas = "Horas",
    Minutos = "Minutos",
}
export type TimeUnitType = keyof typeof TimeUnitsEnum;




export interface ISavedObject<T> {
    savedTimeStamp: number; // saved time
    appVersion: string;
    value: T;
}

export interface ISavedObjectWithId<T, Tid> extends ISavedObject<T> {
    id: Tid;
}