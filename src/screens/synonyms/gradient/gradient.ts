export function calculateAnimationTargets(
  posStart: number[],
  posEnd: number[],
  colorsStart: string[],
  colorsEnd: string[]
): [posStart: number[], posEnd: number[], colors: string[]] {
  const pStart = Array.from(posStart);
  const pEnd = Array.from(posEnd);
  const cStart = Array.from(colorsStart);
  const cEnd = Array.from(colorsEnd);

  let startLength = cStart.length;
  let endLength = cEnd.length;

  if (startLength % 2 != 0 || endLength % 2 != 0) {
    throw new Error(
      `Arrays have odd length. Position start: ${JSON.stringify(
        pStart
      )}; Position end:  ${JSON.stringify(
        pEnd
      )}; Color start:  ${JSON.stringify(cStart)}; Color end:  ${JSON.stringify(
        cEnd
      )}`
    );
  }
  if (startLength != pStart.length || endLength != pEnd.length) {
    throw new Error(
      `Arrays have mismatch lengths. Position start: ${JSON.stringify(
        pStart
      )}; Position end:  ${JSON.stringify(
        pEnd
      )}; Color start:  ${JSON.stringify(cStart)}; Color end:  ${JSON.stringify(
        cEnd
      )}`
    );
  }

  for (let i = 0; i < Math.max(startLength, endLength); i += 2) {
    if (cStart[i] === cEnd[i]) continue;
    //find matching colors for a transition
    if (startLength <= i || cStart[i] == cEnd[i + 2]) {
      insertColorPair(pStart, cStart, i, cEnd[i]);
      startLength += 2;
    } else if (endLength <= i || cEnd[i] == cStart[i + 2]) {
      insertColorPair(pEnd, cEnd, i, cStart[i]);
      endLength += 2;
    }
    //didn't find matches, insert new colors into each array set
    else {
      insertColorPair(pStart, cStart, i, cEnd[i]);
      insertColorPair(pEnd, cEnd, i + 2, cStart[i + 2]);
      startLength += 2;
      endLength += 2;
    }
  }
  return [pStart, pEnd, cStart];
}

//insert a width-0 strip of color into gradient
//[0, 0.5, 0.5, 1] ["r", "r", "b", "b"] => [0, 0.5, 0.5, 0.5, 0.5, 1, 1] ["r", "r",  "g", "g", "b", "b"]
export function insertColorPair(
  positions: number[],
  colors: string[],
  index: number,
  color: string
) {
  colors.splice(index, 0, color, color);
  const newPosition = positions[index - 1] ?? 0;
  positions.splice(index, 0, newPosition, newPosition);
}

//remove duplicate number sequences longer than 2 entries and corresponding elements from color array
export function trimAnimationArrays(pos: number[], colors: string[]) {
  let length = pos.length;
  if (length != colors.length) {
    throw new Error(
      `Position and colors array have different length. Positions: ${JSON.stringify(
        pos
      )}; Colors: ${JSON.stringify(colors)}`
    );
  }
  for (let i = 0; i < length; i++) {
    if (pos[i - 1] == undefined || pos[i - 1] == pos[i]) {
      while (pos[i + 1] == undefined || pos[i + 1] == pos[i]) {
        pos.splice(i, 1);
        colors.splice(i, 1);
        length--;
        if (i >= length) break;
      }
    }
  }
}
