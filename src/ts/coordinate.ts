class Coordinate {

    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    public x(): number {
        return this._x;
    }

    public y(): number {
        return this._y;
    }

    public equals(another: Coordinate): boolean {
        return another.x() == this.x() && another.y() == this.y();
    }

}

export default Coordinate;
