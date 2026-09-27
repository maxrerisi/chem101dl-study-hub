function renderUnit6Practice(container) {
  function kcFromConcProblem() {
    // A <=> B, Kc = [B]/[A]
    const A = randFloat(0.1, 2.0, 2);
    const B = randFloat(0.1, 2.0, 2);
    const Kc = B / A;
    return {
      text: `For the reaction A ⇌ B at equilibrium, [A] = ${A} M and [B] = ${B} M. What is K_c?`,
      type: "numeric",
      answer: Kc,
      tolerance: 0.02,
      units: "",
      solution: `K_c = [B]/[A] = ${B}/${A} = ${fmtNum(Kc)}`,
    };
  }

  function qVsKMc() {
    const Q = randFloat(0.1, 10, 2);
    const K = randFloat(0.1, 10, 2);
    let dir;
    if (Math.abs(Q - K) / K < 0.05) dir = "at equilibrium";
    else if (Q < K) dir = "shift forward (toward products)";
    else dir = "shift in reverse (toward reactants)";
    const opts = shuffle([
      { text: "Shift forward (toward products)", correct: dir.includes("forward") },
      { text: "Shift in reverse (toward reactants)", correct: dir.includes("reverse") },
      { text: "Already at equilibrium", correct: dir.includes("equilibrium") },
    ]);
    return {
      text: `Q = ${Q} and K = ${K} for a reaction. Which way will the reaction shift to reach equilibrium?`,
      type: "mc",
      choices: opts,
      solution: `Q < K → shifts forward (toward products). Q > K → shifts in reverse (toward reactants). Q = K → already at equilibrium. Here Q=${Q}, K=${K}, so it will ${dir}.`,
    };
  }

  function leChatelierMc() {
    const cases = [
      { stress: "Adding more reactant to an equilibrium mixture", shift: "toward products (forward)" },
      { stress: "Removing product from an equilibrium mixture", shift: "toward products (forward)" },
      { stress: "Increasing the volume (decreasing pressure) of a gas-phase equilibrium with more moles of gas on the product side", shift: "toward products (forward)" },
      { stress: "Increasing the volume (decreasing pressure) of a gas-phase equilibrium with more moles of gas on the reactant side", shift: "toward reactants (reverse)" },
      { stress: "Adding an inert gas at constant volume", shift: "no shift (no change in concentrations)" },
    ];
    const c = choice(cases);
    const allShifts = [...new Set(cases.map((x) => x.shift))];
    const opts = shuffle(allShifts.map((s) => ({ text: s, correct: s === c.shift })));
    return {
      text: `Le Châtelier's Principle: "${c.stress}." Which way does the equilibrium shift?`,
      type: "mc",
      choices: opts,
      solution: `${c.stress} causes the equilibrium to shift ${c.shift}.`,
    };
  }

  buildPractice(container, () => choice([kcFromConcProblem, qVsKMc, leChatelierMc])());
}
