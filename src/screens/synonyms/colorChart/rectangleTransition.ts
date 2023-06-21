import Rectangle from "./rectangle";

export type RectangleTransition = { start: Rectangle; end: Rectangle };

//Gives rectangle a unique identifier based on its color
export function GetTransitionsKeys(rects: RectangleTransition[]) {
  const result = new Map<string, RectangleTransition>();
  const colors = new Map<string, number>();
  rects.forEach((rect) => {
    const colorCount = 1 + (colors.get(rect.end.color) ?? 0);
    colors.set(rect.end.color, colorCount);
    result.set(rect.end.color + colorCount, rect);
  });
  return result;
}
