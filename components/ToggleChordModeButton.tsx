import React from "react";

import GameContext from "../src/ts/context";

import * as Logic from "../src/ts/game-logic";

type Props = {
    context: GameContext;
}

export function updateChordInnerHTML(context: GameContext): void {
    const elem = document.getElementById(`${context.name()}-toggleChordMode`)!;
    elem.innerHTML = context.chordMode() ? "exit chord mode" : "switch to chord mode";
}

const ToggleChordModeButton = (props: Props) => {
    return (
        <button
            className="toggleChordModeButton"
            id={`${props.context.name()}-toggleChordMode`}
            onClick={() => Logic.toggleChordButtonClicked(props.context)}
        >switch to chord mode</button>
    );
};

export default ToggleChordModeButton;
