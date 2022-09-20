import React, { Component } from "react";
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
].map(url => require(`../public/${url}`));

function UnknownDifficultyScreen() {
    return (
        <>
            <p>unknown difficulty.</p>
            <DifficultySelect />
        </>
    );
}
function LoadingScreen() {
    return (
        <>
            <p>loading resources...</p>
        </>
    );
}
function LoadErrScreen() {
    return (
        <>
            <p>failed to load resources.</p>
        </>
    );
}

interface IProps { }
interface IState {
    loaded: boolean;
    loadErr: boolean;
    unknownDifficulty: boolean;
}

class Main extends Component<IProps, IState> {

    private _context: GameContext;
    private _difficulty: Difficulty;

    constructor (props: IProps) {
        super(props);

        this.state = {
            loaded: false,
            loadErr: false,
            unknownDifficulty: false
        };

        this._context = GameContext.inactiveContext(GAME_ID, EASY);
        this._difficulty = EASY;

        if (isOnBrowser()) {
            this.init();
            this.loadImages();
        }
    }

    public init(): void {
        const params = new URLSearchParams(window.location.search);
        const diffParam = params.get("d");
        if (diffParam != null) {
            if (!Difficulties.exists(diffParam)) {
                this.state = {
                    loaded: false,
                    loadErr: false,
                    unknownDifficulty: true
                };
            } else {
                this._difficulty = Difficulties.get(diffParam)!;
            }
        }

        this._context = GameContext.inactiveContext(GAME_ID, this._difficulty);
    }

    public loadImages(): void {
        const promises = IMAGES_TO_LOAD.map(obj => {
            return new Promise<void>((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve();
                img.onerror = () => reject();
                img.src = obj.default.src;
            });
        });
        
        Promise.all(promises)
            .then(() => this.setState({ loadErr: false }))
            .catch(() => this.setState({ loadErr: true }))
            .finally(() => this.setState({ loaded: true }));
    }

    public render() {
            if (this.state.unknownDifficulty) {
                return UnknownDifficultyScreen();
            }

            return (
                <>
                    <Head>
                        <title>Minesweeper</title>
                    </Head>
                    {
                        !this.state.loaded ? LoadingScreen() :
                        this.state.loaded && this.state.loadErr ? LoadErrScreen() :
                        <div>
                            <Game context={this._context} />
                            <div>
                                <p>difficulty:</p>
                                <DifficultySelect />
                            </div>
                            <AboutPage />
                        </div>
                    }
                </>
            );
    }
}

export default Main;
