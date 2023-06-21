export default class Rectangle {
  constructor(
    public left: number,
    public bottom: number,
    public width: number,
    public height: number,
    public color: string
  ) {}

  static Zero() {
    return { left: 0, bottom: 0, width: 0, height: 0, color: "white" };
  }
}

export function RectToString(rect: Rectangle, fixedDecimals = 10) {
  return `L: ${rect.left.toFixed(fixedDecimals)} B: ${rect.bottom.toFixed(
    fixedDecimals
  )} W: ${rect.width} H:${rect.height} C:${rect.color}`;
}

export function LerpRectanglesWor(
  progress: number,
  rect1: Rectangle,
  rect2: Rectangle
) {
  return new Rectangle(
    Lerp(progress, rect1.left, rect2.left),
    Lerp(progress, rect1.bottom, rect2.bottom),
    Lerp(progress, rect1.width, rect2.width),
    Lerp(progress, rect1.height, rect2.height),
    rect2.color
  );
}

function Lerp(progress: number, start: number, end: number) {
  return (1 - progress) * start + progress * end;
}

//matches arrays of rectangles index to index by color, by inserting new 0-width rectangles when colors differ
export function AlignRectangles(
  startRects: Rectangle[],
  endRects: Rectangle[]
): [startRects: Rectangle[], endRects: Rectangle[]] {
  startRects = Array.from(startRects);
  endRects = Array.from(endRects);
  let startLength = startRects.length;
  let endLength = endRects.length;
  const defHeight = startRects[0]?.height || endRects[0]?.height || 0;

  for (let i = 0; i < Math.max(startLength, endLength); i += 1) {
    if (startRects[i]?.color === endRects[i]?.color) continue;
    //find matching colors for a transition
    if (startLength <= i || startRects[i]?.color == endRects[i + 1]?.color) {
      spliceRect(startRects, i, defHeight, endRects[i].color);
      startLength += 1;
    } else if (
      endLength <= i ||
      endRects[i]?.color == startRects[i + 1]?.color
    ) {
      spliceRect(endRects, i, defHeight, startRects[i].color);
      endLength += 1;
    }
    //didn't find matches, insert new colors into each array set
    else {
      spliceRect(startRects, i, defHeight, endRects[i].color);
      spliceRect(endRects, i + 1, defHeight, startRects[i + 1].color);
      startLength += 1;
      endLength += 1;
    }
  }
  return [startRects, endRects];
}

//insert a width-0 rectangle of color
export function spliceRect(
  rects: Rectangle[],
  index: number,
  height: number,
  color: string
) {
  const prevRect = rects[index - 1];
  const left = prevRect ? prevRect.left + prevRect.width : 0;
  rects.splice(index, 0, {
    left: left,
    width: 0,
    height: height,
    bottom: 0,
    color: color,
  });
}
