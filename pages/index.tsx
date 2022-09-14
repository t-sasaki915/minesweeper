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
import Minesweeper from "../src/ts/minesweeper";
import * as ContFn from "../src/ts/contextual-functions";
import { cellElemAt_, nearCells } from "../src/ts/util";

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

const TIMER_ID = "main";
const MINE_COUNTER_ID = "mineRemain";

let context: GameContext = GameContext.inactiveContext();

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

    if (!context.chordMode()) {
        setFlag(coord);
    }
}

function toggleFlagButtonClicked(): void {
    if (!context.hasGameInstance() || !context.isActive()) {
        return;
    }

    const elem = document.getElementById("toggleFlag")!;

    if (context.flagMode()) {
        for (let x = 0; x < WIDTH(); x ++) {
            for (let y = 0; y < HEIGHT(); y ++) {
                const c = new Coordinate(x, y);

                if (cellElemAt_(c).className.indexOf("cell-flag-placeholder") != -1) {
                    cellElemAt_(c).className = "cell cell-not-opened";
                }
            }
        }

        elem.innerHTML = "switch to flag mode";
        context.setFlagMode(false);
    } else {
        for (let x = 0; x < WIDTH(); x ++) {
            for (let y = 0; y < HEIGHT(); y ++) {
                const c = new Coordinate(x, y);

                if (ContFn.NOT_OPENED(c, context) && ContFn.NOT_FLAGGED(c, context)) {
                    cellElemAt_(c).className = "cell cell-flag-placeholder";
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

    const elem = document.getElementById("toggleChord")!;

    if (context.chordMode()) {
        elem.innerHTML = "switch to chord mode";
        context.setChordMode(false);
    } else {
        elem.innerHTML = "exit chord mode";
        context.setChordMode(true);
    }
}

function chordOpen(coord: Coordinate): void {
    if (ContFn.NOT_OPENED(coord, context)) {
        return;
    }

    const num = ContFn.CALC_NUM(coord, context);

    const cells = nearCells(
        coord,
        WIDTH(),
        HEIGHT()
    ).filter(c => ContFn.NOT_OPENED(c, context));

    if (cells.filter(c => ContFn.IS_FLAGGED(c, context)).length == num) {
        const notFlaggedMine = cells.filter(c =>
            ContFn.NOT_FLAGGED(c, context) &&
            ContFn.IS_MINE(c, context)
        );
        if (notFlaggedMine.length != 0) {
            endGame(notFlaggedMine[0]);
            return;
        }

        cells
            .filter(c => ContFn.NOT_FLAGGED(c, context))
            .forEach(c => normalOpen(c));
    }
}

function normalOpen(coord: Coordinate): void {
    if (ContFn.IS_OPENED(coord, context) || ContFn.IS_FLAGGED(coord, context)) {
        return;
    }

    if (ContFn.IS_MINE(coord, context)) {
        endGame(coord);
    } else {
        openCellTailrec(coord);
    }
}

function openCell(coord: Coordinate): void {
    if (
        ContFn.IS_MINE(coord, context) ||
        ContFn.IS_OPENED(coord, context) ||
        ContFn.IS_FLAGGED(coord, context)
    ) {
        return;
    }

    const elem = cellElemAt_(coord);
    const num = ContFn.CALC_NUM(coord, context);

    elem.className = `cell cell-num-${num}`;
    elem.innerHTML = `${num}`;

    ContFn.ADD_OPENED(coord, context);

    const neutrals = context.gameInstance()!.neutrals();
    if (context.openedCells().length == neutrals.length) {
        clearGame();
    }
}

function openCellTailrec(coord: Coordinate): void {
    if (ContFn.IS_MINE(coord, context)) {
        return;
    }

    openCell(coord);

    if (ContFn.CALC_NUM(coord, context) == 0) {
        const cells = nearCells(
            coord,
            WIDTH(),
            HEIGHT()
        ).filter(c =>
            ContFn.NOT_OPENED(c, context) &&
            ContFn.NOT_MINE(c, context) &&
            ContFn.NOT_FLAGGED(c, context)
        );

        cells.forEach(c => openCellTailrec(c));
    }
}

function setFlag(coord: Coordinate): void {
    if (ContFn.IS_OPENED(coord, context)) {
        return;
    }

    const elem = cellElemAt_(coord);

    if (ContFn.IS_FLAGGED(coord, context)) {
        addCount(MINE_COUNTER_ID, 1);

        if (context.flagMode()) {
            elem.className = "cell cell-flag-placeholder";
        } else {
            elem.className = "cell cell-not-opened";
        }

        ContFn.REMOVE_FLAGGED(coord, context);
    } else {
        addCount(MINE_COUNTER_ID, -1);

        elem.className = "cell cell-flag";
            
        ContFn.ADD_FLAGGED(coord, context);
    }
}

function init(): void {
    context = GameContext.inactiveContext();

    resetTimer(TIMER_ID);
    resetCount(MINE_COUNTER_ID);

    document.getElementById("toggleFlag")!.innerHTML = "switch to flag mode";
    document.getElementById("toggleChord")!.innerHTML = "switch to chord mode";

    for (let x = 0; x < WIDTH(); x ++) {
        for (let y = 0; y < HEIGHT(); y ++) {
            const elem = cellElemAt_(new Coordinate(x, y));

            elem.className = "cell cell-not-opened";
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

    startTimer(TIMER_ID);

    setCount(MINE_COUNTER_ID, NUM_OF_MINES());

    openCellTailrec(coord);
}

function restartButtonClicked(): void {
    init();
}

function clearGame(): void {
    stopTimer(TIMER_ID);

    context
        .gameInstance()!
        .mines()
        .map(c => c.coord())
        .forEach(c => {
            if (ContFn.NOT_FLAGGED(c, context)) {
                cellElemAt_(c).className = "cell cell-mine";
            }
        });

    context.setActive(false);

    setTimeout(() => {
        alert("cleared");
    }, 1);
}

function endGame(coord: Coordinate): void {
    stopTimer(TIMER_ID);
    
    context
        .gameInstance()!
        .mines()
        .map(c => c.coord())
        .forEach(c => {
            if (ContFn.NOT_FLAGGED(c, context)) {
                cellElemAt_(c).className = "cell cell-mine";
            } 
        });

    cellElemAt_(coord).className = "cell cell-mine-cause";

    context
        .flaggedCells()
        .forEach(c => {
            if (ContFn.NOT_MINE(c, context)) {
                cellElemAt_(c).className = "cell cell-flag-miss";
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
                <button id="toggleFlag" onClick={() => toggleFlagButtonClicked()}>switch to flag mode</button>
                <button id="toggleChord" onClick={() => toggleChordButtonClicked()}>switch to chord mode</button>
                <button id="restart" onClick={() => restartButtonClicked()}>restart</button>
                <br />
                <div>
                    <p>time: <Timer id={TIMER_ID} />s</p>
                    <p>mine remains: <Counter id={MINE_COUNTER_ID} /></p>
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
