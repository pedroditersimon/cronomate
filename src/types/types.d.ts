export interface LinkType {
    to: string;
    target?: string;
}


export enum TimeUnitsEnum {
    Horas = "Horas",
    Minutos = "Minutos",
}
export type TimeUnitType = keyof typeof TimeUnitsEnum;
