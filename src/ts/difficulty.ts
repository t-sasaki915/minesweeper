export class Difficulty {

    private _id: string;
    private _width: number;
    private _height: number;
    private _numOfMines: number;

    constructor(
        id: string,
        width: number,
        height: number,
        numOfMines: number
    ) {
        this._id = id;
        this._width = width;
        this._height = height;
        this._numOfMines = numOfMines;
    }

    public id(): string {
        return this._id;
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

export const DIFFICULTIES = [
    EASY,
    NORMAL,
    HARD
];

class Difficulties {

    public static exists(id: string): boolean {
        return DIFFICULTIES.some(e => e.id() == id);
    }

    public static get(id: string): Difficulty | null {
        if (this.exists(id)) {
            return DIFFICULTIES.filter(e => e.id() == id)[0];
        } else {
            return null;
        }
    }

}

export default Difficulties;
