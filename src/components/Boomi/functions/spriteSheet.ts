import { Rectangle, Texture } from "pixi.js";

export const CELL = 32;

export function frame(sheet: Texture, row: number, col: number) {
  return new Texture({
    source: sheet.source,
    frame: new Rectangle(col * CELL, row * CELL, CELL, CELL),
  });
}

export function rowFrames(
  sheet: Texture,
  row: number,
  fromCol: number,
  toCol: number
) {
  const out: Texture[] = [];
  for (let c = fromCol; c <= toCol; c++) out.push(frame(sheet, row, c));
  return out;
}
