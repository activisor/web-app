import { shuffleArray } from '@/lib/arrays';

test("shuffle array", () => {
  const members = [
    "Art",
    "Art",
    "David",
    "David",
    "Isaac",
    "Isaac",
    "Marc",
    "Marc",
    "Richard",
    "Richard"
  ];
  const length = members.length;

  const result = shuffleArray(members);
  expect(result.length).toBe(length);

  console.log(result);
});