import React from "react";
import Head from "next/head";

import { Minesweeper } from "../src/ts/minesweeper";

const game = Minesweeper.generate(9, 9, 10);

function Main() {
    return (
        <>
            <Head>
                <title>Minesweeper</title>
            </Head>
            <p>test</p>
        </>
    );
}

export default Main;
