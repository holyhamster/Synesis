import ColorNormal from "../screens/synonyms/colorChart/colorNormal";
import WordNormal from "../dictionaries/data/wordNormal";
import Rectangle, {
  AlignRectangles,
  LerpRectangles,
} from "../screens/synonyms/colorChart/rectangle";

const wordNormal1 = new WordNormal();
wordNormal1.push(
  { value: 0.2, word: "sky" },
  { value: 0.3, word: "forest" },
  { value: 0.5, word: "mountain" }
);

const wordNormal2 = new WordNormal();
wordNormal2.push({ value: 0.5, word: "sky" }, { value: 0.5, word: "forest" });

const colorMap = new Map([
  ["mountain", "brown"],
  ["sky", "blue"],
  ["forest", "green"],
]);

test("Normals pipeline", () => {
  const colorNormal = new ColorNormal(wordNormal1, colorMap);
  expect(colorNormal.IsValid).toBe(true);

  const noColorsNormal = new ColorNormal(wordNormal1, new Map());
  expect(noColorsNormal.IsValid).toBe(false);

  const gradient = colorNormal.ToGradient();
  expect(gradient[0].width).toBe(0.2);
});

test("lerp rectangle", () => {
  const rect1 = { bottom: 0, left: 0, height: 0, width: 0, color: "blue" };
  const rect2 = { bottom: 1, left: 1, height: 1, width: 1, color: "red" };
  const test = LerpRectangles(0.5, rect1, rect2);
  const result = {
    bottom: 0.5,
    left: 0.5,
    height: 0.5,
    width: 0.5,
    color: "red",
  };
  expect(test).toEqual(result);
});

test("convert normals to transition rectangles", () => {
  const size = { width: 100, height: 50 };
  const startRects = new ColorNormal(wordNormal1, colorMap)
    .ToGradient()
    .ToRectangle(size);
  expect(startRects.length).toEqual(3);
  expect(startRects[1].width).toEqual(30);

  const endRects = new ColorNormal(wordNormal2, colorMap)
    .ToGradient()
    .ToRectangle(size);
  const [alignedStart, alignedEnd] = AlignRectangles(startRects, endRects);
  expect(alignedEnd.length).toEqual(3);
});
