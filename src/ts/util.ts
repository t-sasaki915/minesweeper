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

export function nearCells(
    center: Coordinate,
    width: number,
    height: number
): Array<Coordinate> {
    const centerX = center.x();
    const centerY = center.y();

    const nearCells = [];

    for (let i = -1; i < 2; i ++) {
        for (let j = -1; j < 2; j ++) {
            const nx = centerX + i;
            const ny = centerY + j;

            if (nx == centerX && ny == centerY) {
                continue;
            }
            if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
                continue;
            }

            nearCells.push(new Coordinate(nx, ny));
        }
    }

    return nearCells;
}
