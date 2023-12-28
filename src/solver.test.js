const solver = require("./solver");
const words = require("./words");

const config = {
  words: words,
  attempts: [
    {
      id: 1,
      value: "check",
      letters: [
        { idx: 1, value: "C", result: "NO" },
        { idx: 2, value: "H", result: "NO" },
        { idx: 3, value: "E", result: "WARM" },
        { idx: 4, value: "C", result: "NO" },
        { idx: 5, value: "K", result: "NO" },
      ],
    },
    {
      id: 2,
      value: "pride",
      letters: [
        { idx: 1, result: "WARM", value: "P" },
        { idx: 2, result: "NO", value: "R" },
        { idx: 3, result: "NO", value: "I" },
        { idx: 4, result: "NO", value: "D" },
        { idx: 5, result: "YES", value: "E" },
      ],
    },
    {
      id: 3,
      value: "chime",
      letters: [
        { idx: 1, value: "C", result: "NO" },
        { idx: 2, value: "H", result: "NO" },
        { idx: 3, value: "I", result: "NO" },
        { idx: 4, value: "M", result: "NO" },
        { idx: 5, value: "E", result: "YES" },
      ],
    },
    {
      id: 4,
      value: "lapse",
      letters: [
        { idx: 1, value: "L", result: "WARM" },
        { idx: 2, value: "A", result: "NO" },
        { idx: 3, value: "P", result: "WARM" },
        { idx: 4, value: "S", result: "WARM" },
        { idx: 5, value: "E", result: "YES" },
      ],
    },
    {
      id: 5,
      value: "slope",
      letters: [
        { idx: 1, value: "S", result: "YES" },
        { idx: 2, value: "L", result: "YES" },
        { idx: 3, value: "O", result: "YES" },
        { idx: 4, value: "P", result: "YES" },
        { idx: 5, value: "E", result: "YES" },
      ],
    },
  ],
};

test("five attempts, target word is slope", () => {
  const result = solver(config);

  expect(result.attempts.length).toBe(5);

  expect(
    result.attempts[0].possibilities
      .flatMap((x) => x.letters)
      .filter((x) => ["C", "H", "E", "K"].includes(x))
  ).toStrictEqual([]);

  expect(
    result.attempts[0].possibilities
      .map((x) => ({ value: x.value, letter: x.value[2] }))
      .filter((x) => ["E"].includes(x.letter))
  ).toStrictEqual([]);

  expect(
    result.attempts[1].possibilities
      .flatMap((x) => x.letters)
      .filter((x) => ["R", "I", "D"].includes(x))
  ).toStrictEqual([]);

  expect(
    result.attempts[1].possibilities
      .map((x) => ({ value: x.value, letter: x.value[0] }))
      .filter((x) => ["P"].includes(x.letter))
  ).toStrictEqual([]);

  expect(
    result.attempts[1].possibilities
      .map((x) => ({ value: x.value, letter: x.value[4] }))
      .every((x) => ["E"].includes(x.letter))
  ).toBe(true);

  expect(
    result.attempts[3].possibilities
      .flatMap((x) => x.letters)
      .filter((x) => ["C", "H", "I", "M"].includes(x))
  ).toStrictEqual([]);

  expect(
    result.attempts[3].possibilities
      .map((x) => ({ value: x.value, letter: x.value[4] }))
      .every((x) => ["E"].includes(x.letter))
  ).toBe(true);

  expect(
    result.attempts[4].possibilities
      .flatMap((x) => x.letters)
      .filter((x) => ["A"].includes(x))
  ).toStrictEqual([]);

  expect(result.attempts[4].possibilities.map((x) => x.value)).toStrictEqual([
    "SLOPE",
  ]);
});

test("boche is an attempt, goose is eliminated", () => {
  const local = {
    words: words,
    attempts: [
      {
        id: 1,
        value: "boche",
        letters: [
          { idx: 1, value: "B", result: "NO" },
          { idx: 2, value: "O", result: "WARM" },
          { idx: 3, value: "C", result: "NO" },
          { idx: 4, value: "H", result: "NO" },
          { idx: 5, value: "E", result: "YES" },
        ],
      },
    ],
  };

  const result = solver(local);

  expect(result.attempts.length).toBe(1);
  expect(
    result.attempts[0].possibilities
      .map((x) => ({ value: x.value, letter: x.value[1] }))
      .filter((x) => x.letter === "O")
  ).toStrictEqual([]);
  // expect(result.attempts[0].possibilities.map((x) => x.value)).not.toContain(
  //   "GOOSE"
  // );
});
