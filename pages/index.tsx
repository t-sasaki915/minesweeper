import React from "react";
import Head from "next/head";

import { Minesweeper } from "../src/ts/minesweeper";

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
                <a href="#" className="cell cell-mine"></a>
            </div>
        </>
    );
}

export default Main;
