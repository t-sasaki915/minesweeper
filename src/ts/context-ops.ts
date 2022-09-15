import Coordinate from "./coordinate";
import GameContext from "./context";
import { runSafely } from "./util";

class GameContextOps {

    private _context: GameContext;

    constructor (context: GameContext) {
        this._context = context;
    }

    public context(): GameContext {
        return this._context;
    }

    public calcNum(coord: Coordinate): number {
        return this.run<number>(
            (safeContext: GameContext) =>
                safeContext
                    .gameInstance()!
                    .calcNumber(coord)
        );
    }

    public isMine(coord: Coordinate): boolean {
        return this.run<boolean>(
            (safeContext: GameContext) =>
                safeContext
                    .gameInstance()!
                    .cellAt(coord)
                    .isMine()
        );
    }

    public notMine(coord: Coordinate): boolean {
        return !this.isMine(coord);
    }

    public isNeutral(coord: Coordinate): boolean {
        return this.notMine(coord);
    }

    public notNeutral(coord: Coordinate): boolean {
        return !this.isNeutral(coord);
    }

    public isOpened(coord: Coordinate): boolean {
        return this.run<boolean>(
            (safeContext: GameContext) =>
                safeContext
                    .openedCells()
                    .some(c => c.equals(coord))
        );
    }

    public notOpened(coord: Coordinate): boolean {
        return !this.isOpened(coord);
    }

    public isFlagged(coord: Coordinate): boolean {
        return this.run<boolean>(
            (safeContext: GameContext) =>
                safeContext
                    .flaggedCells()
                    .some(c => c.equals(coord))
        );
    }

    public notFlagged(coord: Coordinate): boolean {
        return !this.isFlagged(coord);
    }

    public addOpened(coord: Coordinate): void {
        return this.run<void>(
            (safeContext: GameContext) =>
                safeContext.setOpenedCells(
                    safeContext
                        .openedCells()
                        .concat([coord])
                )
        );
    }

    public addFlagged(coord: Coordinate): void {
        return this.run<void>(
            (safeContext: GameContext) =>
                safeContext.setFlaggedCells(
                    safeContext
                        .flaggedCells()
                        .concat([coord])
                )
        );
    }

    public removeFlagged(coord: Coordinate): void {
        return this.run<void>(
            (safeContext: GameContext) =>
                safeContext.setFlaggedCells(
                    safeContext
                        .flaggedCells()
                        .filter(c => !c.equals(coord))
                )
        );
    }

    public static apply(context: GameContext): GameContextOps {
        return new GameContextOps(context);
    }

    private run<T>(r: (safeContext: GameContext) => T): T {
        return runSafely<T>(
            this.context(),
            r
        );
    }

}

export default GameContextOps;
