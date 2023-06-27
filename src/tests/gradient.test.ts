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

const colorNormal1 = new ColorNormal(wordNormal1, colorMap);
const colorNormal2 = new ColorNormal(wordNormal2, colorMap);

test("converting normals to gradient", () => {
  expect(colorNormal1.IsValid).toBe(true);
  expect(colorNormal2.IsValid).toBe(true);

  const noColorsNormal = new ColorNormal(wordNormal1, new Map());
  expect(noColorsNormal.IsValid).toBe(false);

  const gradient = colorNormal1.ToGradient();
  expect(gradient[0].width).toBe(0.2);
  expect(gradient[0].color).toBe("blue");
});

test("lerping rectangles", () => {
  const rect1 = { bottom: 0, left: 0, height: 0, width: 0, color: "blue" };
  const rect2 = { bottom: 1, left: 1, height: 1, width: 1, color: "red" };
  const result = {
    bottom: 0.5,
    left: 0.5,
    height: 0.5,
    width: 0.5,
    color: "red",
  };
  expect(LerpRectangles(0.5, rect1, rect2)).toEqual(result);
});

test("converting normals to transition rectangles", () => {
  const size = { width: 100, height: 50 };
  const startRects = colorNormal1.ToGradient().ToRectangle(size);
  expect(startRects.length).toEqual(3);
  expect(startRects[1].width).toEqual(30);

  const endRects = colorNormal2.ToGradient().ToRectangle(size);
  expect(endRects.length).toEqual(2);
  expect(endRects[1].width).toEqual(50);

  const [alignedStart, alignedEnd] = AlignRectangles(startRects, endRects);
  expect(alignedEnd.length).toEqual(3);
});
