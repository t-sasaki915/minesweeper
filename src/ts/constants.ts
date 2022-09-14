import Coordinate from "./coordinate";

export const IS_MINE: (coord: Coordinate, cells: Array<Coordinate>) =>
  (coord, cells) => cells.some(c => c.equals_(coord))
