import React, { useEffect } from "react";
import Head from "next/head";

import AboutPage from "../components/AboutPage";
import DifficultySelect from "../components/DifficultySelect";
import Game from "../components/Game";

import GameContext from "../src/ts/context";
import Difficulties, { Difficulty, EASY } from "../src/ts/difficulty";
import { isOnBrowser } from "../src/ts/util";

const GAME_ID = "main";

function Main() {
    if (isOnBrowser()) {
        let difficulty = EASY;

        const params = new URLSearchParams(window.location.search);
        const diffParam = params.get("d");
        if (diffParam != null) {
            if (!Difficulties.exists(diffParam)) {
                return (
                    <>
                        <p>unknown difficulty.</p>
                        <DifficultySelect />
                    </>
                );
            }

            difficulty = Difficulties.get(diffParam)!;
        }

        const context = GameContext.inactiveContext(GAME_ID, difficulty);

        return (
            <>
                <Head>
                    <title>Minesweeper</title>
                </Head>
                <Game context={context} />
                <div>
                    <p>difficulty:</p>
                    <DifficultySelect />
                </div>
                <AboutPage />
            </>
        );
    }

    return (
        <>
        </>
    );
}

export default Main;
