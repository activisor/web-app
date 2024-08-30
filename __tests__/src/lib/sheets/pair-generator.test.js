import { generatePairs } from "@/lib/sheets/pair-generator";

test("generate correct number of pairs", () => {
  const members = ["Art", "David", "Isaac", "Marc", "Richard"];
  const weeks = 30;

  const result = generatePairs(members, weeks);
  expect(result.length).toBe(weeks);

  console.log(result);
});
