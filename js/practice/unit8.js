function renderUnit8Practice(container) {
  function gibbsProblem() {
    const dH = randInt(-200, 200); // kJ/mol
    const dS = randInt(-200, 200); // J/(mol K)
    const T = randInt(250, 400);
    const dG = dH - (T * dS) / 1000; // kJ/mol
    return {
      text: `A reaction has ΔH° = ${dH} kJ/mol and ΔS° = ${dS} J/(mol·K) at T = ${T} K. What is ΔG° (in kJ/mol)?`,
      type: "numeric",
      answer: dG,
      tolerance: 0.03,
      units: "kJ/mol",
      solution: `ΔG° = ΔH° − TΔS° = ${dH} − (${T}×${dS}/1000) = ${dH} − ${fmtNum((T * dS) / 1000)} = ${fmtNum(dG)} kJ/mol`,
    };
  }

  function spontaneityMc() {
    const cases = [
      { dH: "negative", dS: "positive", result: "Spontaneous at all temperatures" },
      { dH: "positive", dS: "negative", result: "Nonspontaneous at all temperatures" },
      { dH: "negative", dS: "negative", result: "Spontaneous only at low temperatures" },
      { dH: "positive", dS: "positive", result: "Spontaneous only at high temperatures" },
    ];
    const c = choice(cases);
    const allResults = cases.map((x) => x.result);
    const opts = shuffle(allResults.map((r) => ({ text: r, correct: r === c.result })));
    return {
      text: `If ΔH is ${c.dH} and ΔS is ${c.dS}, when is the reaction spontaneous (ΔG < 0)?`,
      type: "mc",
      choices: opts,
      solution: `ΔG = ΔH − TΔS. With ΔH ${c.dH} and ΔS ${c.dS}: ${c.result.toLowerCase()}.`,
    };
  }

  function dGFromKProblem() {
    const K = choice([0.01, 0.1, 0.5, 2, 10, 100, 1000]);
    const T = randInt(280, 350);
    const R = CONSTANTS.R;
    const dG0 = -R * T * Math.log(K); // J/mol
    return {
      text: `A reaction has K = ${K} at T = ${T} K. What is ΔG° (in J/mol)? (Use R = 8.314 J/(mol·K).)`,
      type: "numeric",
      answer: dG0,
      tolerance: 0.03,
      units: "J/mol",
      solution: `ΔG° = −RT ln(K) = −(8.314)(${T})ln(${K}) = ${fmtNum(dG0)} J/mol`,
    };
  }

  function entropyTrendMc() {
    const pairs = [
      { text: "H₂O(g) vs. H₂O(l)", answer: "H₂O(g) has higher entropy", reason: "Gases have much higher entropy than liquids at the same temperature due to greater positional/motional freedom." },
      { text: "1 mol O₂(g) vs. 1 mol O₃(g)", answer: "O₃(g) has higher entropy", reason: "More complex molecules (more atoms, more ways to distribute energy) generally have higher molar entropy." },
      { text: "NaCl(s) vs. NaCl(aq)", answer: "NaCl(aq) has higher entropy", reason: "Dissolving increases disorder — ions become more dispersed and mobile in solution." },
      { text: "1 mol Ar(g) at 300 K vs. 1 mol Ar(g) at 500 K", answer: "Ar(g) at 500 K has higher entropy", reason: "Entropy increases with temperature (more accessible energy states)." },
    ];
    const p = choice(pairs);
    const wrongs = pairs.filter((x) => x !== p).map((x) => x.answer);
    const opts = shuffle([{ text: p.answer, correct: true }, ...shuffle(wrongs).slice(0, 2).map((w) => ({ text: w, correct: false }))]);
    return {
      text: `Which has the higher entropy: ${p.text}?`,
      type: "mc",
      choices: opts,
      solution: p.reason,
    };
  }

  buildPractice(container, () => choice([gibbsProblem, spontaneityMc, dGFromKProblem, entropyTrendMc])());
}
