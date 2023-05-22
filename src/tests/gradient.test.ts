import ColorNormal from "../screens/synonyms/data/colorNormal";
import WordNormal from "../screens/synonyms/data/wordNormal";

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
  const gradient = colorN.getGradientValues();
  expect(gradient[0].length).toBe(wordN.length * 2);
  expect(gradient[0][3]).toBe(0.5);
});
