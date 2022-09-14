import Coordinate from "./coordinate";
import GameContext from "./context";
import { runSafely } from "./util";

export const IS_MINE: (coord: Coordinate, context: GameContext) => boolean =
    (coord, context) => {
        const run = (safeContext: GameContext) =>
            safeContext
                .gameInstance()!
                .cellAt_(coord)
                .isMine();

        return runSafely<boolean>(
            context,
            run
        );
    }

export const NOT_MINE: (coord: Coordinate, context: GameContext) => boolean =
    (coord, context) =>
        !IS_MINE(coord, context);

export const IS_NEUTRAL: (coord: Coordinate, context: GameContext) => boolean =
    (coord, context) =>
        NOT_MINE(coord, context);

export const NOT_NEUTRAL: (coord: Coordinate, context: GameContext) => boolean =
    (coord, context) =>
        IS_MINE(coord, context);

export const IS_OPENED: (coord: Coordinate, context: GameContext) => boolean =
    (coord, context) => {
        const run = (safeContext: GameContext) =>
            safeContext
                .openedCells()
                .some(c => c.equals_(coord));

        return runSafely<boolean>(
            context,
            run
        );
    }

export const IS_FLAGGED: (coord: Coordinate, context: GameContext) => boolean =
    (coord, context) => {
        const run = (safeContext: GameContext) =>
            safeContext
                .flaggedCells()
                .some(c => c.equals_(coord));
        
        return runSafely<boolean>(
            context,
            run
        );
    }

export const ADD_OPENED: (coord: Coordinate, context: GameContext) => void =
    (coord, context) => {
        const run = (safeContext: GameContext) =>
            safeContext.setOpenedCells(
                context
                    .openedCells()
                    .concat([coord])
            );

        return runSafely<void>(
            context,
            run
        );
    }

export const ADD_FLAGGED: (coord: Coordinate, context: GameContext) => void =
    (coord, context) => {
        const run = (safeContext: GameContext) =>
            safeContext.setFlaggedCells(
                safeContext
                    .flaggedCells()
                    .concat([coord])
            );

        return runSafely<void>(
            context,
            run
        );
    }

export const REMOVE_FLAGGED: (coord: Coordinate, context: GameContext) => void =
    (coord, context) => {
        const run = (safeContext: GameContext) =>
            safeContext.setFlaggedCells(
                safeContext
                    .flaggedCells()
                    .filter(c => !c.equals_(coord))
            );

        return runSafely<void>(
            context,
            run
        );
    }
