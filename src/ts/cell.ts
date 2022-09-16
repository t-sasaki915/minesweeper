import Coordinate from "./coordinate";

abstract class Cell {

    private _coord: Coordinate;

    constructor(coord: Coordinate) {
        this._coord = coord;
    }

    public coord(): Coordinate {
        return this._coord;
    }

    public abstract isMine(): boolean;

}

export class NeutralCell extends Cell {

    public isMine(): boolean {
        return false;
    }

}

export class MineCell extends Cell {

    public isMine(): boolean {
        return true;
    }

}

export default Cell;
