import React, { useEffect } from "react";
import Head from "next/head";

import AboutPage from "../components/AboutPage";
import Counter, { addCount, setCount, resetCount } from "../components/Counter";
import DifficultySelect from "../components/DifficultySelect";
import Game from "../components/Game";
import Timer, { startTimer, stopTimer, resetTimer } from "../components/Timer";

import Coordinate from "../src/ts/coordinate";
import Difficulties, { Difficulty, EASY } from "../src/ts/difficulty";
import GameContext from "../src/ts/context";
import GameContextOps from "../src/ts/context-ops";
import Minesweeper from "../src/ts/minesweeper";
import { cellElemAt, nearCells } from "../src/ts/util";

import * as Consts from "../src/ts/constants";

let difficulty: Difficulty | null = EASY;

const WIDTH = () => {
    return difficulty!.width();
}
const HEIGHT = () => {
    return difficulty!.height();
}
const NUM_OF_MINES = () => {
    return difficulty!.numOfMines();
}

let context: GameContext = GameContext.inactiveContext();
let contextOps: GameContextOps = GameContextOps.apply(context);

function cellClicked(coord: Coordinate): void {
    if (!context.hasGameInstance()) {
        return startGame(coord);
    }
    if (!context.isActive()) {
        return;
    }

    if (context.flagMode()) {
        setFlag(coord);
    } else {
        if (context.chordMode()) {
            chordOpen(coord);
        } else {
            normalOpen(coord);
        }
    }
}

function cellRightClicked(coord: Coordinate): void {
    if (!context.hasGameInstance() || !context.isActive()) {
        return;
    }

    if (!context.flagMode()) {
        setFlag(coord);
    }
}

function toggleFlagButtonClicked(): void {
    if (!context.hasGameInstance() || !context.isActive()) {
        return;
    }

    const elem = document.getElementById(Consts.TOGGLE_FLAG_BUTTON_ID)!;

    if (context.flagMode()) {
        for (let x = 0; x < WIDTH(); x ++) {
            for (let y = 0; y < HEIGHT(); y ++) {
                const c = new Coordinate(x, y);

                if (cellElemAt(c).className.indexOf("cell-flag-placeholder") != -1) {
                    cellElemAt(c).className = Consts.CELL_NOT_OPENED_CLASS;
                }
            }
        }

        elem.innerHTML = "switch to flag mode";
        context.setFlagMode(false);
    } else {
        for (let x = 0; x < WIDTH(); x ++) {
            for (let y = 0; y < HEIGHT(); y ++) {
                const c = new Coordinate(x, y);

                if (contextOps.notOpened(c) && contextOps.notFlagged(c)) {
                    cellElemAt(c).className = Consts.CELL_FLAG_PLACEHOLDER_CLASS;
                }
            }
        }

        elem.innerHTML = "exit flag mode";
        context.setFlagMode(true);
    }
}

function toggleChordButtonClicked(): void {
    if (!context.hasGameInstance() || !context.isActive()) {
        return;
    }

    const elem = document.getElementById(Consts.TOGGLE_CHORD_BUTTON_ID)!;

    if (context.chordMode()) {
        elem.innerHTML = "switch to chord mode";
        context.setChordMode(false);
    } else {
        elem.innerHTML = "exit chord mode";
        context.setChordMode(true);
    }
}

function chordOpen(coord: Coordinate): void {
    if (contextOps.notOpened(coord)) {
        return;
    }

    const num = contextOps.CALC_NUM(coord);

    const cells = nearCells(
        coord,
        WIDTH(),
        HEIGHT()
    ).filter(c => contextOps.notOpened(c));

    if (cells.filter(c => contextOps.isFlagged(c)).length == num) {
        const notFlaggedMine = cells.filter(c =>
            contextOps.notFlagged(c) &&
            contextOps.isMine(c)
        );
        if (notFlaggedMine.length != 0) {
            endGame(notFlaggedMine[0]);
            return;
        }

        cells
            .filter(c => contextOps.notFlagged(c))
            .forEach(c => normalOpen(c));
    }
}

function normalOpen(coord: Coordinate): void {
    if (contextOps.isOpened(coord) || contextOps.isFlagged(coord)) {
        return;
    }

    if (contextOps.isMine(coord)) {
        endGame(coord);
    } else {
        openCellTailrec(coord);
    }
}

function openCell(coord: Coordinate): void {
    if (
        contextOps.isMine(coord) ||
        contextOps.isOpened(coord) ||
        contextOps.isFlagged(coord)
    ) {
        return;
    }

    const elem = cellElemAt(coord);
    const num = contextOps.calcNum(coord);

    elem.className = `${Consts.CELL_NUM_CLASS}${num}`;
    elem.innerHTML = `${num}`;

    contextOps.addOpened(coord);

    const neutrals = context.gameInstance()!.neutrals();
    if (context.openedCells().length == neutrals.length) {
        clearGame();
    }
}

function openCellTailrec(coord: Coordinate): void {
    if (contextOps.isMine(coord)) {
        return;
    }

    openCell(coord);

    if (contextOps.calcNum(coord) == 0) {
        const cells = nearCells(
            coord,
            WIDTH(),
            HEIGHT()
        ).filter(c =>
            contextOps.notOpened(c) &&
            contextOps.notMine(c) &&
            contextOps.notFlagged(c)
        );

        cells.forEach(c => openCellTailrec(c));
    }
}

function setFlag(coord: Coordinate): void {
    if (contextOps.isOpened(coord)) {
        return;
    }

    const elem = cellElemAt(coord);

    if (contextOps.isFlagged(coord)) {
        addCount(Consts.MINE_COUNTER_ID, 1);

        if (context.flagMode()) {
            elem.className = Consts.CELL_FLAG_PLACEHOLDER_CLASS;
        } else {
            elem.className = Consts.CELL_NOT_OPENED_CLASS;
        }

        contextOps.removeFlagged(coord);
    } else {
        addCount(Consts.MINE_COUNTER_ID, -1);

        elem.className = Consts.CELL_FLAG_CLASS;
            
        contextOps.addFlagged(coord);
    }
}

function init(): void {
    context = GameContext.inactiveContext();
    contextOps = GameContextOps.apply(context);

    resetTimer(Consts.TIMER_ID);
    resetCount(Consts.MINE_COUNTER_ID);

    document.getElementById(Consts.TOGGLE_FLAG_BUTTON_ID)!.innerHTML = "switch to flag mode";
    document.getElementById(Consts.TOGGLE_CHORD_BUTTON_ID)!.innerHTML = "switch to chord mode";

    for (let x = 0; x < WIDTH(); x ++) {
        for (let y = 0; y < HEIGHT(); y ++) {
            const elem = cellElemAt(new Coordinate(x, y));

            elem.className = Consts.CELL_NOT_OPENED_CLASS;
            elem.innerHTML = "0";
        }
    }
}

function startGame(coord: Coordinate): void {
    init();

    const blacklist = nearCells(
        coord,
        WIDTH(),
        HEIGHT(),
        true
    );

    context.setInstance(
        Minesweeper.generate(
            WIDTH(),
            HEIGHT(),
            NUM_OF_MINES(),
            blacklist
        )
    );
    context.setActive(true);

    startTimer(Consts.TIMER_ID);

    setCount(Consts.MINE_COUNTER_ID, NUM_OF_MINES());

    openCellTailrec(coord);
}

function restartButtonClicked(): void {
    init();
}

function clearGame(): void {
    stopTimer(Consts.TIMER_ID);

    context
        .gameInstance()!
        .mines()
        .map(c => c.coord())
        .forEach(c => {
            if (contextOps.notFlagged(c)) {
                cellElemAt(c).className = Consts.CELL_MINE_CLASS;
            }
        });

    context.setActive(false);

    setTimeout(() => {
        alert("cleared");
    }, 1);
}

function endGame(coord: Coordinate): void {
    stopTimer(Consts.TIMER_ID);
    
    context
        .gameInstance()!
        .mines()
        .map(c => c.coord())
        .forEach(c => {
            if (contextOps.notFlagged(c)) {
                cellElemAt(c).className = Consts.CELL_MINE_CLASS;
            } 
        });

    cellElemAt(coord).className = Consts.CELL_MINE_CAUSE_CLASS;

    context
        .flaggedCells()
        .forEach(c => {
            if (contextOps.notMine(c)) {
                cellElemAt(c).className = Consts.CELL_FLAG_MISS_CLASS;
            }
        });

    context.setActive(false);
}

function Main() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const difficultyParam = params.get("d");
        if (difficultyParam != null) {
            difficulty = Difficulties.get(difficultyParam);
        }
    });

    if (difficulty == null) {
        return (
            <>
                <p>unknown difficulty.</p>
                <DifficultySelect />
            </>
        );
    }

    return (
        <>
            <Head>
                <title>Minesweeper</title>
            </Head>
            <Game width={WIDTH()}
                  height={HEIGHT()}
                  cellClicked={c => cellClicked(c)}
                  cellRightClicked={c => cellRightClicked(c)}
            />
            <br />
            <div>
                <button id={Consts.TOGGLE_FLAG_BUTTON_ID} onClick={() => toggleFlagButtonClicked()}>switch to flag mode</button>
                <button id={Consts.TOGGLE_CHORD_BUTTON_ID} onClick={() => toggleChordButtonClicked()}>switch to chord mode</button>
                <button id={Consts.RESTART_BUTTON_ID} onClick={() => restartButtonClicked()}>restart</button>
                <br />
                <div>
                    <p>time: <Timer id={Consts.TIMER_ID} />s</p>
                    <p>mine remains: <Counter id={Consts.MINE_COUNTER_ID} /></p>
                </div>
            </div>
            <div>
                <p>difficulty:</p>
                <DifficultySelect />
            </div>
            <AboutPage />
        </>
    );
}

export default Main;
