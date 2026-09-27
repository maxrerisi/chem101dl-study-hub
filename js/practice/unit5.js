function renderUnit5Practice(container) {
  function heatProblem() {
    const m = randInt(20, 200);
    const Cs = choice([4.184, 0.385, 0.129, 0.233, 2.42]); // water, Cu, Au, Ag, ethanol-ish
    const dT = randInt(5, 50);
    const q = m * Cs * dT;
    return {
      text: `How much heat (in J) is required to raise the temperature of ${m} g of a substance (C_s = ${Cs} J/(g·°C)) by ${dT}°C?`,
      type: "numeric",
      answer: q,
      tolerance: 0.02,
      units: "J",
      solution: `q = mC_sΔT = ${m} × ${Cs} × ${dT} = ${fmtNum(q)} J`,
    };
  }

  function hessProblem() {
    const dH1 = randInt(-400, -50);
    const dH2 = randInt(-300, 300);
    const mult1 = choice([1, 2]);
    const mult2 = choice([1, -1]);
    const total = mult1 * dH1 + mult2 * dH2;
    return {
      text: `Using Hess's Law: Reaction 1 has ΔH = ${dH1} kJ and is used ${mult1 === 1 ? "as written" : "×2"}. Reaction 2 has ΔH = ${dH2} kJ and is ${mult2 === 1 ? "used as written" : "reversed"}. What is ΔH for the overall (summed) reaction?`,
      type: "numeric",
      answer: total,
      tolerance: 0.02,
      units: "kJ",
      solution: `ΔH_total = (${mult1}×${dH1}) + (${mult2}×${dH2}) = ${fmtNum(mult1 * dH1)} + ${fmtNum(mult2 * dH2)} = ${fmtNum(total)} kJ`,
    };
  }

  function exoEndoMc() {
    const cases = [
      { text: "Combustion of methane", answer: "Exothermic" },
      { text: "Melting of ice", answer: "Endothermic" },
      { text: "Photosynthesis", answer: "Endothermic" },
      { text: "Neutralization of a strong acid with a strong base", answer: "Exothermic" },
      { text: "Sublimation of dry ice", answer: "Endothermic" },
    ];
    const c = choice(cases);
    const opts = shuffle([
      { text: "Exothermic (releases heat, ΔH < 0)", correct: c.answer === "Exothermic" },
      { text: "Endothermic (absorbs heat, ΔH > 0)", correct: c.answer === "Endothermic" },
    ]);
    return {
      text: `Is the following process exothermic or endothermic? "${c.text}"`,
      type: "mc",
      choices: opts,
      solution: `${c.text} is ${c.answer.toLowerCase()}.`,
    };
  }

  buildPractice(container, () => choice([heatProblem, hessProblem, exoEndoMc])());
}
