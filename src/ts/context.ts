import Coordinate from "./coordinate";
import Minesweeper from "./minesweeper";

class GameContext {

    private _isActive: boolean;
    private _gameInstance: Minesweeper | null;
    private _openedCells: Array<Coordinate>;
    private _flaggedCells: Array<Coordinate>;
    private _flagMode: boolean;
    private _chordMode: boolean;

    constructor (
        isActive: boolean,
        gameInstance: Minesweeper | null,
        openedCells: Array<Coordinate>,
        flaggedCells: Array<Coordinate>,
        flagMode: boolean,
        chordMode: boolean
    ) {
        this._isActive = isActive;
        this._gameInstance = gameInstance;
        this._openedCells = openedCells;
        this._flaggedCells = flaggedCells;
        this._flagMode = flagMode;
        this._chordMode = chordMode;
    }

    public isActive(): boolean {
        return this._isActive;
    }
    public setActive(active: boolean): void {
        this._isActive = active;
    }

    public gameInstance(): Minesweeper | null {
        return this._gameInstance;
    }
    public setInstance(instance: Minesweeper | null): void {
        this._gameInstance = instance;
    }

    public openedCells(): Array<Coordinate> {
        return this._openedCells;
    }
    public setOpenedCells(arr: Array<Coordinate>): void {
        this._openedCells = arr;
    }

    public flaggedCells(): Array<Coordinate> {
        return this._flaggedCells;
    }
    public setFlaggedCells(arr: Array<Coordinate>): void {
        this._flaggedCells = arr;
    }

    public flagMode(): boolean {
        return this._flagMode;
    }
    public setFlagMode(flagMode: boolean): void {
        this._flagMode = flagMode;
    }

    public chordMode(): boolean {
        return this._chordMode;
    }
    public setChordMode(chordMode: boolean): void {
        this._chordMode = chordMode;
    }

    public hasGameInstance(): boolean {
        return this.gameInstance() != null;
    }

    public static inactiveContext(): GameContext {
        return new GameContext(
            false,
            null,
            [],
            [],
            false,
            false
        );
    }

}

export default GameContext;
