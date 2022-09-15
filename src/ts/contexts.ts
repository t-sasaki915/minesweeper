import { Difficulty } from "./difficulty";
import GameContext from "./context";

const CONTEXTS: Array<GameContext> = [];

class GameContexts {

    constructor () { }

    public static getContext(name: string): GameContext {
        return CONTEXTS.filter(c => c.name() == name)[0];
    }

    public static createGame(name: string, difficulty: Difficulty): GameContext {
        const context = GameContext.inactiveContext(name, difficulty);
        CONTEXTS.push(context);

        return this.getContext(name);
    }

}

export default GameContexts;
