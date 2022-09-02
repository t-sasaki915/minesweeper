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

export class Coordinate {

    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    public x(): number {
        return this._x;
    }

    public y(): number {
        return this._y;
    }

    public equals(x: number, y: number): boolean {
        return this.x() == x && this.y() == y;
    }

    public equals_(coord: Coordinate): boolean {
        return this.equals(coord.x(), coord.y());
    }

}
