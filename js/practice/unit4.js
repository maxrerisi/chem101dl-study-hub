function renderUnit4Practice(container) {
  function firstOrderProblem() {
    const A0 = randFloat(0.5, 2.0, 2);
    const k = randFloat(0.01, 0.1, 3);
    const t = randInt(10, 100);
    const At = A0 * Math.exp(-k * t);
    return {
      text: `A first-order reaction has [A]₀ = ${A0} M and k = ${k} s⁻¹. What is [A] after t = ${t} s?`,
      type: "numeric",
      answer: At,
      tolerance: 0.02,
      units: "M",
      solution: `ln[A]_t = −kt + ln[A]₀\n[A]_t = [A]₀ e^(−kt) = ${A0} × e^(−${k}×${t})\n= ${fmtNum(At)} M`,
    };
  }

  function halfLifeProblem() {
    const k = randFloat(0.005, 0.2, 4);
    const t12 = 0.693 / k;
    return {
      text: `A first-order reaction has a rate constant k = ${k} s⁻¹. What is its half-life?`,
      type: "numeric",
      answer: t12,
      tolerance: 0.02,
      units: "s",
      solution: `t½ = 0.693 / k = 0.693 / ${k} = ${fmtNum(t12)} s`,
    };
  }

  function secondOrderProblem() {
    const A0 = randFloat(0.2, 1.5, 2);
    const k = randFloat(0.01, 0.2, 3);
    const t = randInt(5, 50);
    const At = 1 / (k * t + 1 / A0);
    return {
      text: `A second-order reaction has [A]₀ = ${A0} M and k = ${k} M⁻¹s⁻¹. What is [A] after t = ${t} s?`,
      type: "numeric",
      answer: At,
      tolerance: 0.02,
      units: "M",
      solution: `1/[A]_t = kt + 1/[A]₀ = ${k}×${t} + 1/${A0}\n[A]_t = ${fmtNum(At)} M`,
    };
  }

  function arrheniusProblem() {
    const A = choice([1e10, 1e11, 1e12, 1e13]);
    const Ea = randInt(40, 120) * 1000; // J/mol
    const T = randInt(280, 400);
    const R = CONSTANTS.R;
    const k = A * Math.exp(-Ea / (R * T));
    return {
      text: `Using the Arrhenius equation, find k given A = ${A.toExponential(0)}, Ea = ${Ea / 1000} kJ/mol, and T = ${T} K. (Use R = 8.314 J/(mol·K); give k in the same units as A.)`,
      type: "numeric",
      answer: k,
      tolerance: 0.03,
      units: "",
      solution: `k = A e^(−Ea/RT) = ${A.toExponential(0)} × e^(−${Ea}/(8.314×${T}))\n= ${fmtNum(k)}`,
    };
  }

  function orderMc() {
    const orders = [
      { name: "Zero-order", linear: "[A] vs. t" },
      { name: "First-order", linear: "ln[A] vs. t" },
      { name: "Second-order", linear: "1/[A] vs. t" },
    ];
    const o = choice(orders);
    const opts = shuffle(orders.map((x) => ({ text: x.linear, correct: x.name === o.name })));
    return {
      text: `For a ${o.name.toLowerCase()} reaction, which plot gives a straight line?`,
      type: "mc",
      choices: opts,
      solution: `Zero-order → [A] vs t is linear. First-order → ln[A] vs t is linear. Second-order → 1/[A] vs t is linear (this is how reaction order is determined experimentally).`,
    };
  }

  buildPractice(container, () => choice([firstOrderProblem, halfLifeProblem, secondOrderProblem, arrheniusProblem, orderMc])());
}
