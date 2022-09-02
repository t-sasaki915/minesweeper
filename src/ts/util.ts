import Coordinate from "./coordinate";

export function range(min: number, max: number): Array<number> {
    return Array.from(Array(max - min).keys()).map(x => x + min);
}

export function randomRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
}

export function cellElemAt(x: number, y: number): HTMLElement {
    return document.getElementById(`${x}-${y}`)!;
}

export function cellElemAt_(coord: Coordinate): HTMLElement {
    return cellElemAt(coord.x(), coord.y());
}
