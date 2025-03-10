export enum SeatType {
    NarrowbodyEconomy = 0,
    NarrowbodyEconomyEmergency = 1,
    NarrowbodyPremiumEconomy = 2,
    NarrowbodyBusiness = 3,
    WidebodyEconomy = 4,
    WidebodyEconomyEmergency = 5,
    WidebodyBusinessFlatRight = 6,
    WidebodyBusinessFlatLeft = 7,
    WidebodySuiteRight = 8,
    WidebodySuiteLeft = 9,
}

export const CanvasConst = Object.freeze({
    width: 1000,
    height: 150,
});
export interface SeatInfo {
    type: number,
    x?: number,
    y?: number,
    yOffset?: number
}

export interface RowInfo {
    x?: number,
    y?: number,
    xOffset?: number,
    yOffset?: number,
    seats: SeatInfo[],
}

export interface PaxStationInfo {
    name: string,
    capacity: number,
    rows: RowInfo[],
    simVar: string,
    fill: number,
    stationIndex: number,
    position: number,
    deck: number
}

export interface CargoStationInfo {
    name: string,
    weight: number,
    simVar: string,
    stationIndex: number,
    progressBarWidth: number,
    position: number,
}

export const SeatConstants = Object.freeze({
    [SeatType.NarrowbodyEconomy]: {
        len: 10,
        wid: 19.2,
        padX: 13,
        padY: 0,
        imageX: 20,
        imageY: 19.2,
    },
    [SeatType.NarrowbodyEconomyEmergency]: {
        len: 10,
        wid: 19.2,
        padX: 20,
        padY: 0,
        imageX: 20,
        imageY: 19.2,
    },
    [SeatType.NarrowbodyPremiumEconomy]: {
        len: 19.2,
        wid: 19.2,
        padX: 20,
        padY: 0,
        imageX: 25.4,
        imageY: 19.2,
    },
    [SeatType.NarrowbodyBusiness]: {
        len: 22.5,
        wid: 22.5,
        padX: 12,
        padY: 0,
        imageX: 25.4,
        imageY: 22.5,
    },
    [SeatType.WidebodyEconomy]: {
        len: 16,
        wid: 12.125,
        padX: 2,
        padY: 0,
        imageX: 16,
        imageY: 12.125,
    },
    [SeatType.WidebodyEconomyEmergency]: {
        len: 16,
        wid: 12.125,
        padX: 2,
        padY: 0,
        imageX: 16,
        imageY: 12.125,
    },
    [SeatType.WidebodyBusinessFlatRight]: {
        len: 30,
        wid: 23.22,
        padX: 1,
        padY: 0,
        imageX: 24,
        imageY: 23.22,
    },
    [SeatType.WidebodyBusinessFlatLeft]: {
        len: 30,
        wid: 23.22,
        padX: 1,
        padY: 0,
        imageX: 24,
        imageY: 23.22,
    },
    [SeatType.WidebodySuiteRight]: {
        len: 40,
        wid: 20,
        padX: 2,
        padY: 0,
        imageX: 50,
        imageY: 50,
    },
    [SeatType.WidebodySuiteLeft]: {
        len: 40,
        wid: 20,
        padX: 5,
        padY: 0,
        imageX: 50,
        imageY: 50,
    },
});

export const Status = Object.freeze({
    Planned: 0,
    Loaded: 1,
});
