import * as Util from "../../../src/ts/util";

import Coordinate from "../../../src/ts/coordinate";

test(
    "'range' should return values between 'min' and 'max'.",
    () => {
        expect(Util.range(1, 5))
            .toStrictEqual([1, 2, 3, 4]);
        expect(Util.range(0, 10))
            .toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        expect(Util.range(0, 0))
            .toStrictEqual([]);
    }
);

test(
    "'nearCells' should return all coords in 3 x 3 range centered at 'center'.",
    () => {
        expect(Util.nearCells(new Coordinate(1, 1), 3, 3, true))
            .toStrictEqual([
                new Coordinate(0, 0),
                new Coordinate(0, 1),
                new Coordinate(0, 2),
                new Coordinate(1, 0),
                new Coordinate(1, 1),
                new Coordinate(1, 2),
                new Coordinate(2, 0),
                new Coordinate(2, 1),
                new Coordinate(2, 2)
            ]);
        expect(Util.nearCells(new Coordinate(0, 0), 3, 3, true))
            .toStrictEqual([
                new Coordinate(0, 0),
                new Coordinate(0, 1),
                new Coordinate(1, 0),
                new Coordinate(1, 1)
            ]);
        expect(Util.nearCells(new Coordinate(1, 1), 3, 3, false))
            .toStrictEqual([
                new Coordinate(0, 0),
                new Coordinate(0, 1),
                new Coordinate(0, 2),
                new Coordinate(1, 0),
                new Coordinate(1, 2),
                new Coordinate(2, 0),
                new Coordinate(2, 1),
                new Coordinate(2, 2)
            ]);
        expect(Util.nearCells(new Coordinate(0, 0), 3, 3, false))
            .toStrictEqual([
                new Coordinate(0, 1),
                new Coordinate(1, 0),
                new Coordinate(1, 1)
            ]);
    }
)
