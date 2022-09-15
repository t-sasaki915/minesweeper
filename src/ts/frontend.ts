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
