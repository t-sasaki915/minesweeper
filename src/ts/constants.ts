import Cell from "./cell";
import Coordinate from "./coordinate";
import Minesweeper from "./minesweeper";

export const TO_COORD_ARRAY: (arr: Array<Cell>) => Array<Coordinate> =
  (arr) => arr.map(c => c.coord());

export const IS_MINE: (x: number, y: number, instance: Minesweeper) => boolean =
  (x, y, instance) => instance.cellAt(x, y).isMine()

export const IS_MINE_: (coord: Coordinate, instance: Minesweeper) => boolean =
  (coord, instance) => IS_MINE(coord.x(), coord.y(), instance);
