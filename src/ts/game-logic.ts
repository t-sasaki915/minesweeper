import { addCount, setCount, resetCount } from "../../components/Counter";
import { startTimer, stopTimer, resetTimer } from "../../components/Timer";
import { updateInnerHTML as updateChordInnerHTML } from "../../components/ToggleChordModeButton";
import { updateFlagInnerHTML } from "../../components/ToggleFlagModeButton";

import Coordinate from "./coordinate";
import GameContext from "./context";
import GameContextOps from "./context-ops";
import Minesweeper from "./minesweeper";
import { nearCells } from "./util";

import * as Consts from "./constants";
import * as FrontEnd from "./frontend";

export function init(
    context: GameContext
): void {
    context.init();

    resetCount(`${context.name()}-mineRemain`);
    resetTimer(`${context.name()}-timer`);

    updateChordInnerHTML(context);
    updateFlagInnerHTML(context);

    const width = context.difficulty().width();
    const height = context.difficulty().height();

    for (let x = 0; x < width; x ++) {
        for (let y = 0; y < height; y ++) {
            const coord = new Coordinate(x, y);

            FrontEnd.setCellClass(
                Consts.DEFAULT_CELL_CLASSES,
                coord,
                context
            );
            FrontEnd.setCellNum(
                0,
                coord,
                context
            );
        }
    }
}

export function cellClicked(
    coord: Coordinate,
    context: GameContext
): void {
    if (!context.hasGameInstance()) {
        return startGame(coord, context);
    }
    if (!context.isActive()) {
        return;
    }

    if (context.flagMode()) {
        setFlag(coord, context);
    } else {
        if (context.chordMode()) {
            chordOpen(coord, context);
        } else {
            normalOpen(coord, context);
        }
    }
}

export function cellRightClicked(
    coord: Coordinate,
    context: GameContext
): void {
    if (!context.hasGameInstance() || !context.isActive()) {
        return;
    }

    if (!context.flagMode()) {
        setFlag(coord, context);
    }
}

export function toggleFlagButtonClicked(
    context: GameContext
): void {
    const contextOps = GameContextOps.apply(context);

    if (!context.hasGameInstance() || !context.isActive()) {
        return;
    }

    const width = context.difficulty().width();
    const height = context.difficulty().height();

    for (let x = 0; x < width; x ++) {
        for (let y = 0; y < height; y ++) {
            const coord = new Coordinate(x, y);

            if (context.flagMode()) {
                if (
                    FrontEnd.getCellClass(
                        coord,
                        context
                    ).indexOf("cell-flag-placeholder") != -1
                ) {
                    FrontEnd.setCellClass(
                        Consts.DEFAULT_CELL_CLASSES,
                        coord,
                        context
                    );
                }
            } else {
                if (contextOps.notOpened(coord) && contextOps.notFlagged(coord)) {
                    FrontEnd.setCellClass(
                        Consts.FLAG_PLACEHOLDER_CELL_CLASSES,
                        coord,
                        context
                    );
                }
            }
        }
    }

    context.setFlagMode(!context.flagMode());
    updateFlagInnerHTML(context);
}

export function toggleChordButtonClicked(
    context: GameContext
): void {
    if (!context.hasGameInstance() || !context.isActive()) {
        return;
    }

    context.setChordMode(!context.chordMode());
    updateChordInnerHTML(context);
}

export function restartButtonClicked(
    context: GameContext
): void {
    init(context);
}

function startGame(
    coord: Coordinate,
    context: GameContext
): void {
    init(context);

    const diff = context.difficulty();

    const blacklist = nearCells(
        coord,
        diff.width(),
        diff.height(),
        true
    );

    context.setInstance(
        Minesweeper.generate(
            diff.width(),
            diff.height(),
            diff.numOfMines(),
            blacklist
        )
    );
    context.setActive(true);

    startTimer(`${context.name()}-timer`);
    setCount(`${context.name()}-mineRemain`, diff.numOfMines());

    openCellTailrec(coord, context);
}

function setFlag(
    coord: Coordinate,
    context: GameContext
): void {
    const contextOps = GameContextOps.apply(context);

    if (contextOps.isOpened(coord)) {
        return;
    }

    if (contextOps.isFlagged(coord)) {
        addCount(`${context.name()}-mineRemain`, 1);

        FrontEnd.setCellClass(
            context.flagMode() ? Consts.FLAG_PLACEHOLDER_CELL_CLASSES
                               : Consts.DEFAULT_CELL_CLASSES,
            coord,
            context
        );

        contextOps.removeFlagged(coord);
    } else {
        addCount(`${context.name()}-mineRemain`, -1);

        FrontEnd.setCellClass(
            Consts.FLAG_CELL_CLASSES,
            coord,
            context
        );
        
        contextOps.addFlagged(coord);
    }
}

function chordOpen(
    coord: Coordinate,
    context: GameContext
): void {
    const contextOps = GameContextOps.apply(context);

    if (contextOps.notOpened(coord)) {
        return;
    }

    const num = contextOps.calcNum(coord);

    const cells = nearCells(
        coord,
        context.difficulty().width(),
        context.difficulty().height()
    ).filter(c => contextOps.notOpened(c));

    if (cells.filter(c => contextOps.isFlagged(c)).length == num) {
        const notFlaggedMines = cells.filter(c =>
            contextOps.notFlagged(c) &&
            contextOps.isMine(c)
        );
        if (notFlaggedMines.length != 0) {
            return endGame(notFlaggedMines[0], context);
        }

        cells
            .filter(c => contextOps.notFlagged(c))
            .forEach(c => openCellTailrec(c, context));
    }
}

function normalOpen(
    coord: Coordinate,
    context: GameContext
): void {
    const contextOps = GameContextOps.apply(context);

    if (contextOps.isOpened(coord) || contextOps.isFlagged(coord)) {
        return;
    }

    if (contextOps.isMine(coord)) {
        endGame(coord, context);
    } else {
        openCellTailrec(coord, context);
    }
}

function openCellTailrec(
    coord: Coordinate,
    context: GameContext
): void {
    const contextOps = GameContextOps.apply(context);

    if (contextOps.isMine(coord)) {
        return;
    }

    openCell(coord, context);

    if (contextOps.calcNum(coord) == 0) {
        const cells = nearCells(
            coord,
            context.difficulty().width(),
            context.difficulty().height()
        ).filter(c =>
            contextOps.notOpened(c) &&
            contextOps.notMine(c) &&
            contextOps.notFlagged(c)
        );

        cells.forEach(c => openCellTailrec(c, context));
    }
}

function openCell(
    coord: Coordinate,
    context: GameContext
): void {
    const contextOps = GameContextOps.apply(context);

    if (
        contextOps.isMine(coord) ||
        contextOps.isOpened(coord) ||
        contextOps.isFlagged(coord)
    ) {
        return;
    }

    const num = contextOps.calcNum(coord);

    FrontEnd.setCellClass(
        `${Consts.NUMBER_CELL_CLASSES}${num}`,
        coord,
        context
    );
    FrontEnd.setCellNum(
        num,
        coord,
        context
    );

    contextOps.addOpened(coord);

    const neutrals = context.gameInstance()!.neutrals();
    if (context.openedCells().length == neutrals.length) {
        clearGame(context);
    }
}

function clearGame(
    context: GameContext
): void {
    const contextOps = GameContextOps.apply(context);

    stopTimer(`${context.name()}-timer`);

    context
        .gameInstance()!
        .mines()
        .map(c => c.coord())
        .forEach(c => {
            if (contextOps.notFlagged(c)) {
                FrontEnd.setCellClass(
                    Consts.MINE_CELL_CLASSES,
                    c,
                    context
                );
            }
        });

    context.setActive(false);

    window.setTimeout(() => {
        alert("cleared");
    }, 1);
}

function endGame(
    coord: Coordinate,
    context: GameContext
): void {
    const contextOps = GameContextOps.apply(context);

    stopTimer(`${context.name()}-timer`);

    context
        .gameInstance()!
        .mines()
        .map(c => c.coord())
        .forEach(c => {
            if (contextOps.notFlagged(c)) {
                FrontEnd.setCellClass(
                    Consts.MINE_CELL_CLASSES,
                    c,
                    context
                );
            }
        });
    
    FrontEnd.setCellClass(
        Consts.MINE_CAUSE_CELL_CLASSES,
        coord,
        context
    );

    context
        .flaggedCells()
        .forEach(c => {
            if (contextOps.notMine(c)) {
                FrontEnd.setCellClass(
                    Consts.FLAG_MISS_CELL_CLASSES,
                    c,
                    context
                );
            }
        });

    context.setActive(false);
}
