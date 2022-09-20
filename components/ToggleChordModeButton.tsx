import React from "react";

import GameContext from "../src/ts/context";

import * as Logic from "../src/ts/game-logic";

export function updateInnerHTML(context: GameContext): void {
    const elem = document.getElementById(`${context.name()}-toggleChordMode`)!;
    elem.innerHTML = context.chordMode() ? "exit chord mode" : "switch to chord mode";
}

type Props = {
    context: GameContext;
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
