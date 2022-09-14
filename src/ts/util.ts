import Coordinate from "./coordinate";
import GameContext from "./context";
import { IllegalStateError } from "./errors";

export function runSafely<T>(context: GameContext, run: (c: GameContext) => T): T {
    if (!context.isActive()) {
        throw new IllegalStateError("GameContext isn't active.");
    }
    if (!context.hasGameInstance()) {
        throw new IllegalStateError("GameContext hasn't game instance.");
    }

    return run(context);
}

export function range(min: number, max: number): Array<number> {
    return Array.from(Array(max - min).keys()).map(x => x + min);
}

export function randomRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
}

export function cellElemAt(coord: Coordinate): HTMLElement {
    return document.getElementById(`${coord.x()}-${coord.y()}`)!;
}

export function nearCells(
    center: Coordinate,
    gameWidth: number,
    gameHeight: number,
    includeCenter: boolean = false
): Array<Coordinate> {
    const centerX = center.x();
    const centerY = center.y();

    const nearCells = [];

    for (let i = -1; i < 2; i ++) {
        for (let j = -1; j < 2; j ++) {
            const nx = centerX + i;
            const ny = centerY + j;

            if (!includeCenter && nx == centerX && ny == centerY) {
                continue;
            }
            if (nx < 0 || nx >= gameWidth || ny < 0 || ny >= gameHeight) {
                continue;
            }

            nearCells.push(new Coordinate(nx, ny));
        }
    }

    return nearCells;
}
