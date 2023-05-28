import {
  calculateAnimationTargets,
  trimAnimationArrays,
} from "../screens/synonyms/gradient/gradient";
import ColorNormal from "../screens/synonyms/gradient/colorNormal";
import WordNormal from "../dictionaries/data/wordNormal";

test("Normals pipeline", () => {
  const wordN = new WordNormal();
  wordN.push(
    { value: 0.2, word: "sky" },
    { value: 0.3, word: "forest" },
    { value: 0.5, word: "mountain" }
  );
  const colorMap = new Map([
    ["mountain", "brown"],
    ["sky", "blue"],
    ["forest", "green"],
  ]);

  const colorN = new ColorNormal(wordN, colorMap);
  const gradient = colorN.toGradientValues();
  expect(gradient[0].length).toBe(wordN.length * 2);
  expect(gradient[0][3]).toBe(0.5);
});

test("Faulty requests", () => {
  const test = calculateAnimationTargets([], [], [], []);
  expect(test).toEqual([[], [], []]);
});

test("no changes", () => {
  const test = calculateAnimationTargets(
    [0, 1],
    [0, 1],
    ["red", "red"],
    ["red", "red"]
  );

  expect(test).toEqual([
    [0, 1],
    [0, 1],
    ["red", "red"],
  ]);
});

test("adding a color at the end", () => {
  const test = calculateAnimationTargets(
    [0, 1],
    [0, 0.5, 0.5, 1],
    ["red", "red"],
    ["red", "red", "blue", "blue"]
  );

  expect(test).toEqual([
    [0, 1, 1, 1],
    [0, 0.5, 0.5, 1],
    ["red", "red", "blue", "blue"],
  ]);
});

test("removing a color at the end", () => {
  const test = calculateAnimationTargets(
    [0, 0.5, 0.5, 1],
    [0, 1],
    ["red", "red", "blue", "blue"],
    ["red", "red"]
  );
  expect(test).toEqual([
    [0, 0.5, 0.5, 1],
    [0, 1, 1, 1],
    ["red", "red", "blue", "blue"],
  ]);
});

test("adding a color in the middle", () => {
  const test = calculateAnimationTargets(
    [0, 0.5, 0.5, 1],
    [0, 0.25, 0.25, 0.75, 0.75, 1],
    ["red", "red", "blue", "blue"],
    ["red", "red", "green", "green", "blue", "blue"]
  );

  expect(test).toEqual([
    [0, 0.5, 0.5, 0.5, 0.5, 1],
    [0, 0.25, 0.25, 0.75, 0.75, 1],
    ["red", "red", "green", "green", "blue", "blue"],
  ]);
});

test("removing a color from the middle", () => {
  const test = calculateAnimationTargets(
    [0, 0.25, 0.25, 0.75, 0.75, 1],
    [0, 0.5, 0.5, 1],
    ["red", "red", "green", "green", "blue", "blue"],
    ["red", "red", "blue", "blue"]
  );

  expect(test).toEqual([
    [0, 0.25, 0.25, 0.75, 0.75, 1],
    [0, 0.5, 0.5, 0.5, 0.5, 1],
    ["red", "red", "green", "green", "blue", "blue"],
  ]);
});

test("swapping colors", () => {
  const test = calculateAnimationTargets(
    [0, 0.25, 0.25, 0.75, 0.75, 1],
    [0, 0.25, 0.25, 0.75, 0.75, 1],
    ["green", "green", "red", "red", "blue", "blue"],
    ["red", "red", "green", "green", "blue", "blue"]
  );

  expect(test).toEqual([
    [0, 0, 0, 0.25, 0.25, 0.75, 0.75, 1],
    [0, 0.25, 0.25, 0.75, 0.75, 0.75, 0.75, 1],
    ["red", "red", "green", "green", "red", "red", "blue", "blue"],
  ]);
});

test("trim arrays", () => {
  const pos = [0, 0, 0, 0.25, 0.25, 0.75, 0.75, 0.75, 0.75, 1, 1, 1];
  const colors = [
    "teal",
    "teal",
    "green",
    "green",
    "red",
    "red",
    "red",
    "red",
    "blue",
    "blue",
    "yellow",
    "yellow",
  ];
  trimAnimationArrays(pos, colors);

  expect(pos).toEqual([0, 0.25, 0.25, 0.75, 0.75, 1]);

  expect(colors).toEqual(["green", "green", "red", "red", "blue", "blue"]);
});

test("problem", () => {
  const t = [1, 2];
  t.splice(4, 0, 2, 2);
  expect(t).toEqual([1, 2, 2, 2]);
  const test = calculateAnimationTargets(
    [0, 0.25, 0.25, 0.75, 0.75, 1],
    [0, 0.643, 0.643, 1],
    ["#r", "#r", "#b", "#b", "#g", "#g"],
    ["#r", "#r", "#y", "#y"]
  );

  expect(test).toEqual([
    [0, 0.25, 0.25, 0.25, 0.25, 0.75, 0.75, 1],
    [0, 0.643, 0.643, 1, 1, 1, 1, 1],
    ["#r", "#r", "#y", "#y", "#b", "#b", "#g", "#g"],
  ]);
});
