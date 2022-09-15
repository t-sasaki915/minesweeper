import React from "react";

import GameContext from "../src/ts/context";
import GameContexts from "../src/ts/contexts";

import * as Logic from "../src/ts/game-logic";

type Props = {
    name: string;
}

export function updateChordInnerHTML(context: GameContext): void {
    const elem = document.getElementById(`${context.name()}-toggleChordMode`)!;
    elem.innerHTML = context.chordMode() ? "exit chord mode" : "switch to chord mode";
}

const ToggleChordModeButton = (props: Props) => {
    const context = GameContexts.getContext(props.name);
    
    return (
        <button
            className="toggleChordModeButton"
            id={`${context.name()}-toggleChordMode`}
            onClick={() => Logic.toggleChordButtonClicked(context)}
        >switch to chord mode</button>
    );
};

export default ToggleChordModeButton;
