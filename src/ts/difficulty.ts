export class Difficulty {

    private _name: string;
    private _width: number;
    private _height: number;
    private _numOfMines: number;

    constructor(
        name: string,
        width: number,
        height: number,
        numOfMines: number
    ) {
        this._name = name;
        this._width = width;
        this._height = height;
        this._numOfMines = numOfMines;
    }

    public name(): string {
        return this._name;
    }

    public width(): number {
        return this._width;
    }

    public height(): number {
        return this._height;
    }

    public numOfMines(): number {
        return this._numOfMines;
    }

}

export const EASY = new Difficulty(
    "easy",
    9,
    9,
    10
);
export const NORMAL = new Difficulty(
    "normal",
    16,
    16,
    40
);
export const HARD = new Difficulty(
    "hard",
    30,
    16,
    99
);
export const IMPOSSIBLE = new Difficulty(
    "impossible",
    9,
    9,
    67
);

export const DIFFICULTIES = [
    EASY,
    NORMAL,
    HARD,
    IMPOSSIBLE
];

class Difficulties {

    public static exists(name: string): boolean {
        return DIFFICULTIES.some(e => e.name() == name);
    }

    public static get(name: string): Difficulty | null {
        if (this.exists(name)) {
            return DIFFICULTIES.filter(e => e.name() == name)[0];
        } else {
            return null;
        }
    }

}

export default Difficulties;
