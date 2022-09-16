import Cell, { NeutralCell, MineCell } from "./cell";
import Coordinate from "./coordinate";
import { IllegalArgumentError } from "./errors";
import { nearCells, randomRange } from "./util";

class Minesweeper {

    private _width: number;
    private _height: number;
    private _numOfMines: number;
    private _cells: Array<Cell>;

    constructor(
        width: number,
        height: number,
        numOfMines: number,
        cells: Array<Cell>
    ) {
        this._width = width;
        this._height = height;
        this._numOfMines = numOfMines;
        this._cells = cells;
    }

    public width(): number {
        return this._width;
    }

    public height(): number {
        return this._height;
    }

    public numOfMines(): number {
        return this._numOfMines;
    }

    public cells(): Array<Cell> {
        return this._cells;
    }

    public mines(): Array<Cell> {
        return this.cells().filter(c => c.isMine());
    }

    public neutrals(): Array<Cell> {
        return this.cells().filter(c => !c.isMine());
    }

    public cellAt(coord: Coordinate): Cell {
        return this.cells().filter(c => c.coord().equals(coord))[0];
    }

    public calcNumber(coord: Coordinate): number {
        if (this.cellAt(coord).isMine()) {
            return 0;
        }

        const cells = nearCells(
            coord,
            this.width(),
            this.height()
        ).map(c => this.cellAt(c));

        return cells.filter(c => c.isMine()).length;
    }

    public static generate(
        width: number,
        height: number,
        numOfMines: number,
        blacklist: Array<Coordinate>
    ): Minesweeper {
        if (width * height < numOfMines) {
            throw new IllegalArgumentError("width * height < number of mines");
        }

        const arr = [];

        for (let y = 0; y < height; y ++) {
            let line = [];

            for (let x = 0; x < width; x ++) {
                line.push(new NeutralCell(new Coordinate(x, y)));
            }

            arr.push(line);
        }
        for (let i = 0; i < numOfMines; i ++) {
            let x = 0;
            let y = 0;

            while (true) {
                const xc = randomRange(0, width);
                const yc = randomRange(0, height);
                
                if (blacklist.some(c => c.equals(new Coordinate(xc, yc)))) {
                    continue;
                }
                if (arr[yc][xc].isMine()) {
                    continue;
                }

                x = xc;
                y = yc;

                break;
            }

            arr[y][x] = new MineCell(new Coordinate(x, y));
        }

        let cells: Array<Cell> = [];
        for (let i = 0; i < height; i ++) {
            cells = cells.concat(arr[i]);
        }

        return new Minesweeper(width, height, numOfMines, cells);
    }

}

export default Minesweeper;
