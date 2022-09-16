import React, { useEffect } from "react";
import Head from "next/head";

import AboutPage from "../components/AboutPage";
import DifficultySelect from "../components/DifficultySelect";
import Game from "../components/Game";

import GameContext from "../src/ts/context";
import Difficulties, { Difficulty, EASY } from "../src/ts/difficulty";
import { isOnBrowser } from "../src/ts/util";

const GAME_ID = "main";
const IMAGES_TO_LOAD = [
    "cellNotOpened.png",
    "flag.png",
    "flagMiss.png",
    "flagPlaceholder.png",
    "mine.png"
];

let doneLoading = false;
let loadingErr = false;

function loadImages(): void {
    const promises = IMAGES_TO_LOAD.map(url => {
        return new Promise<any>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => reject();
            img.src = url;
        });
    });
    
    Promise.all(promises)
        .then(() => {
            loadingErr = false;
        })
        .catch(() => {
            loadingErr = true;
        })
        .finally(() => {
            doneLoading = true;
        });
}

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

        loadImages();
        
        if (!doneLoading) {
            return (
                <>
                    <p>loading images...</p>
                </>
            );
        }
        if (loadingErr) {
            return (
                <>
                    <p>loading failed.</p>
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

    return (
        <>
        </>
    );
}

export default Main;
