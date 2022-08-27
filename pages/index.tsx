import React from "react";
import Head from "next/head";

import { Minesweeper } from "../src/ts/minesweeper";
import { Util } from "../src/ts/util";

const WIDTH = 9;
const HEIGHT = 9;
const NUM_OF_MINES = 10;

const game = Minesweeper.generate(WIDTH, HEIGHT, NUM_OF_MINES);

function Main() {
    return (
        <>
            <Head>
                <title>Minesweeper</title>
            </Head>
            <div>
                {
                    Util.range(0, HEIGHT).map(y =>
                        <div className="line">
                            {
                                Util.range(0, WIDTH).map(x =>
                                    <a href="#"
                                       className={game.cellAt(x, y).isMine() ? "cell cell-mine" : `cell cell-num-${game.calcNumber(x, y)}`}
                                       id={x.toString() + "-" + y.toString()}
                                       draggable="false"
                                    >{ game.calcNumber(x, y) }</a>
                                )
                            }
                        </div>
                    )
                }
            </div>
        </>
    );
}

export default Main;
