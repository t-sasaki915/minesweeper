import { setCount } from "../../components/Counter";

import Coordinate from "./coordinate";
import GameContext from "./context";

export function getCellElem(
    coord: Coordinate,
    context: GameContext
): HTMLElement {
    const id = `${context.name()}-${coord.x()}-${coord.y()}`;
    return document.getElementById(id)!;
}

export function setCellClass(
    newClass: string,
    coord: Coordinate,
    context: GameContext
): void {
    getCellElem(coord, context).className = newClass;
}

export function getCellClass(
    coord: Coordinate,
    context: GameContext
): string {
    return getCellElem(coord, context).className;
}

export function setCellNum(
    newNum: number,
    coord: Coordinate,
    context: GameContext
): void {
    getCellElem(coord, context).innerHTML = `${newNum}`;
}

export function updateClearStreak(
    context: GameContext
): void {
    setCount(
        `${context.name()}-clearStreak`,
	context.clearStreak()
    );
    setCount(
	`${context.name()}-highestClearStreak`,
	context.highestClearStreak()
    );
}
