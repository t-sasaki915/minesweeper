import React, { useEffect } from "react";
import Head from "next/head";

import { v4 as uuidv4 } from "uuid";

import AboutPage from "../components/AboutPage";
import DifficultySelect from "../components/DifficultySelect";
import Game from "../components/Game";

import GameContexts from "../src/ts/contexts";
import Difficulties, { Difficulty, EASY } from "../src/ts/difficulty";

let difficulty: Difficulty | null = EASY;

const GAME_ID = `${uuidv4()}`;

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

    const context = GameContexts.createGame(GAME_ID, difficulty);

    return (
        <>
            <Head>
                <title>Minesweeper</title>
            </Head>
            <Game name={context.name()} />
            <div>
                <p>difficulty:</p>
                <DifficultySelect />
            </div>
            <AboutPage />
        </>
    );
}

export default Main;
