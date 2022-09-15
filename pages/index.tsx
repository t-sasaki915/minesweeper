import React, { useEffect } from "react";
import Head from "next/head";

import AboutPage from "../components/AboutPage";
import DifficultySelect from "../components/DifficultySelect";
import Game from "../components/Game";

import GameContext from "../src/ts/context";
import Difficulties, { Difficulty, EASY } from "../src/ts/difficulty";

const GAME_ID = "main";

function Main() {
    let difficulty: Difficulty | null = EASY;

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

export default Main;
