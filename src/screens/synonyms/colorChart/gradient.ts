import Rectangle from "./rectangle";

type colorSection = { color: string; start: number; width: number };
type rectSize = { height: number; width: number };

//[{color:"red", start:0, end: .5}, {color:"blue", start: .5, end: 1}]
export default class Gradient extends Array<colorSection> {
  constructor(...items: colorSection[]) {
    super(...(items ?? []));
  }

  ToRectangle(size: rectSize): Rectangle[] {
    return this.map(
      (colorSection) =>
        new Rectangle(
          colorSection.start * size.width,
          0,
          colorSection.width * size.width,
          size.height,
          colorSection.color
        )
    );
  }
}
