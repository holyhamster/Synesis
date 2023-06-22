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

export function LerpRectangles(
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
  start: Rectangle[],
  end: Rectangle[]
): [startRects: Rectangle[], endRects: Rectangle[]] {
  start = Array.from(start);
  end = Array.from(end);
  let startLength = start.length;
  let endLength = end.length;
  const defHeight = start[0]?.height || end[0]?.height || 0;

  for (let i = 0; i < Math.max(startLength, endLength); i += 1) {
    if (start[i]?.color === end[i]?.color) continue;
    //find matching colors for a transition
    if (startLength <= i || start[i]?.color == end[i + 1]?.color) {
      spliceRect(start, i, defHeight, end[i].color);
      startLength += 1;
    } else if (endLength <= i || end[i]?.color == start[i + 1]?.color) {
      spliceRect(end, i, defHeight, start[i].color);
      endLength += 1;
    }
    //didn't find matches, insert new colors into each array set
    else {
      spliceRect(start, i, defHeight, end[i].color);
      spliceRect(end, i + 1, defHeight, start[i + 1].color);
      startLength += 1;
      endLength += 1;
    }
  }
  return [start, end];
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
