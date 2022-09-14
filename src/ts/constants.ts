import Cell from "./cell";
import Coordinate from "./coordinate";

export const TO_COORD_ARRAY: (arr: Array<Cell>) => Array<Coordinate> =
  (arr) => arr.map(c => c.coord());

export const IS_MINE: (coord: Coordinate, cells: Array<Coordinate>) => boolean =
  (coord, cells) => cells.some(c => c.equals_(coord));
