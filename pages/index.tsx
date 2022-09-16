import React, { Component, useState } from "react";
import Head from "next/head";

import AboutPage from "../components/AboutPage";
import DifficultySelect from "../components/DifficultySelect";
import Game from "../components/Game";

import GameContext from "../src/ts/context";
import Difficulties, { Difficulty, EASY } from "../src/ts/difficulty";
import { isOnBrowser } from "../src/ts/util";

const GAME_ID = "main";
const IMAGES_TO_LOAD = [
    "../cellNotOpened.png",
    "flag.png",
    "flagMiss.png",
    "flagPlaceholder.png",
    "mine.png"
];

function LoadingScreen() {
    return (
        <>
            <p>loading images...</p>
        </>
    );
}

function LoadErrScreen() {
    return (
        <>
            <p>load failed.</p>
        </>
    );
}

function GameScreen(context: GameContext) {
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

interface IProps {
}
interface IState {
    loaded: boolean;
    loadErr: boolean;
}

class Main extends Component<IProps, IState> {

    constructor (props: IProps) {
        super(props);

        this.state = {
            loaded: false,
            loadErr: false
        };

        this.loadImages = this.loadImages.bind(this);
    }

    loadImages(): void {
        const promises = IMAGES_TO_LOAD.map(url => {
            return new Promise<void>((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve();
                img.onerror = () => reject();
                img.src = url;
            });
        });
        
        Promise.all(promises)
            .then(() => {
                this.setState({
                    loaded: true,
                    loadErr: false
                });
            })
            .catch(() => {
                this.setState({
                    loaded: true,
                    loadErr: true
                });
            });
    }

    render() {
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

            this.loadImages();

            const context = GameContext.inactiveContext(GAME_ID, difficulty);

            return (
                <>
                    {
                        this.state.loaded
                            ? this.state.loadErr
                                ? LoadErrScreen()
                                : GameScreen(context)
                            : LoadingScreen()
                    }
                </>
            );
        }

        return <></>;
    }

}

export default Main;
