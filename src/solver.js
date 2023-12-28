const groupAtttempts = (attempts, i) => {
  const attemptsCumulative = attempts.filter((x) => x.id <= i);

  const grouped = attemptsCumulative
    .filter((x) => x.id <= i)
    .flatMap((x) => x.letters)
    .reduce((acc, curr) => {
      if (acc.hasOwnProperty(curr.value)) {
        if (acc[curr.value].find((x) => x.result !== curr.result)) {
          acc[curr.value].push(curr);
        }
      } else {
        acc[curr.value] = [curr];
      }
      return acc;
    }, []);
  return grouped;
};

const buildFilteredIndexes = (grouped, letter) => {
  const filteredIndexes = [];
  if (grouped[letter.value].length === 1) {
    if (letter.result === "WARM") {
      filteredIndexes.push(letter.idx);
    } else {
      filteredIndexes.push(...[1, 2, 3, 4, 5]);
    }
  } else {
    filteredIndexes.push(
      ...grouped[letter.value]
        .filter((x) => x.result != "YES")
        .map((x) => x.idx)
    );
  }
  return filteredIndexes;
};
const processYes = (entry, letter) => {
  for (let j = entry.possibilities.length - 1; j >= 0; j--) {
    const check = entry.possibilities[j].letters.find(
      (y) => y.idx === letter.idx && y.value === letter.value
    );
    if (!check) {
      entry.possibilities.splice(j, 1);
    }
  }
};

const processWarm = (entry, letter, filteredIndexes) => {
  for (let j = entry.possibilities.length - 1; j >= 0; j--) {
    const p = entry.possibilities[j];
    // retrieve the letter indexes NOT in the warm position
    const filtered = p.letters.filter(
      (y) => filteredIndexes.includes(y.idx) === false
    );

    // check if the remaining letters match the WARM letter
    const check = filtered.some((y) => y.value === letter.value);
    const check2 = p.letters.find(
      (y) => y.idx === letter.idx && y.value !== letter.value
    );
    if (!check || !check2) {
      entry.possibilities.splice(j, 1);
    }
  }
};

const processNo = (entry, letter, filteredIndexes) => {
  for (let j = entry.possibilities.length - 1; j >= 0; j--) {
    const check = entry.possibilities[j].letters
      .filter((y) => filteredIndexes.includes(y.idx))
      .some((y) => y.value === letter.value);
    if (check) {
      entry.possibilities.splice(j, 1);
    }
  }
};

const solverPrivate = (words, attempts, i) => {
  const entry = { idx: i, possibilities: [...words] };

  const grouped = groupAtttempts(attempts, i);

  for (const letter of attempts.flatMap((x) => x.letters)) {
    const filteredIndexes = buildFilteredIndexes(grouped, letter);

    switch (letter.result) {
      case "YES":
        processYes(entry, letter);
        break;
      case "WARM":
        processWarm(entry, letter, filteredIndexes);
        break;
      case "NO":
        processNo(entry, letter, filteredIndexes);
        break;
    }
  }

  return entry;
};

const wordIndex = (words) => {
  const index = words.map((x) => {
    return {
      value: x,
      letters: Array.from(x).reduce((acc, curr, j) => {
        acc.push({ idx: j + 1, value: curr });
        return acc;
      }, []),
    };
  });

  return index;
};

const solver = (config) => {
  const words = wordIndex(config.words);
  const results = Array.from({ length: config.attempts.length }, (_, i) =>
    solverPrivate(
      words,
      config.attempts.filter((x) => x.id <= i + 1),
      i + 1
    )
  );

  return { attempts: results };
};

module.exports = solver;
