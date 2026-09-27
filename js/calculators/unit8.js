function renderUnit8Calculators(container) {
  buildSolver(container, {
    title: "Gibbs Free Energy (standard)",
    eq: "ΔG° = ΔH° − TΔS°",
    note: "ΔH° and ΔG° in J/mol, ΔS° in J/(mol·K), T in Kelvin. (If working in kJ, convert ΔS° to kJ/(mol·K) first, e.g. divide by 1000.)",
    fields: [
      { key: "dG", label: "ΔG°", units: "J/mol" },
      { key: "dH", label: "ΔH°", units: "J/mol" },
      { key: "dS", label: "ΔS°", units: "J/(mol·K)" },
      { key: "T", label: "T", units: "K" },
    ],
    compute: (v, solveKey) => {
      if (solveKey === "dG") return v.dH - v.T * v.dS;
      if (solveKey === "dH") return v.dG + v.T * v.dS;
      if (solveKey === "dS") return (v.dH - v.dG) / v.T;
      return (v.dH - v.dG) / v.dS;
    },
  });

  buildSolver(container, {
    title: "ΔG° and the Equilibrium Constant",
    eq: "ΔG° = −RT ln(K)",
    fields: [
      { key: "dG0", label: "ΔG°", units: "J/mol" },
      { key: "T", label: "T", units: "K" },
      { key: "K", label: "K (equilibrium constant)", units: "" },
    ],
    compute: (v, solveKey) => {
      const R = CONSTANTS.R;
      if (solveKey === "dG0") return -R * v.T * Math.log(v.K);
      if (solveKey === "T") return -v.dG0 / (R * Math.log(v.K));
      if (v.K !== undefined) {}
      return Math.exp(-v.dG0 / (R * v.T));
    },
  });

  buildSolver(container, {
    title: "ΔG Away From Standard Conditions",
    eq: "ΔG = ΔG° + RT ln(Q)",
    fields: [
      { key: "dG", label: "ΔG", units: "J/mol" },
      { key: "dG0", label: "ΔG°", units: "J/mol" },
      { key: "T", label: "T", units: "K" },
      { key: "Q", label: "Q (reaction quotient)", units: "" },
    ],
    compute: (v, solveKey) => {
      const R = CONSTANTS.R;
      if (solveKey === "dG") return v.dG0 + R * v.T * Math.log(v.Q);
      if (solveKey === "dG0") return v.dG - R * v.T * Math.log(v.Q);
      if (solveKey === "T") return (v.dG - v.dG0) / (R * Math.log(v.Q));
      return Math.exp((v.dG - v.dG0) / (R * v.T));
    },
  });

  buildWeightedSum(container, {
    title: "Reaction Entropy from Absolute Entropies",
    eq: "ΔS°_rxn = ΣnS°_f(products) − ΣmS°_f(reactants)",
    note: "Coefficient = +(stoich. coeff.) for products, −(stoich. coeff.) for reactants. Value = that species' absolute entropy S°.",
    resultLabel: "ΔS°_rxn",
    resultUnits: "",
  });

  buildWeightedSum(container, {
    title: "Reaction Free Energy from ΔG°f",
    eq: "ΔG°_rxn = ΣnΔG°_f(products) − ΣmΔG°_f(reactants)",
    note: "Coefficient = +(stoich. coeff.) for products, −(stoich. coeff.) for reactants. Value = that species' ΔG°f.",
    resultLabel: "ΔG°_rxn",
    resultUnits: "",
  });

  buildSolver(container, {
    title: "van 't Hoff Equation (two temperatures)",
    eq: "ln(K₂/K₁) = −ΔH°/R × (1/T₂ − 1/T₁)",
    fields: [
      { key: "K1", label: "K₁ (at T₁)", units: "" },
      { key: "K2", label: "K₂ (at T₂)", units: "" },
      { key: "T1", label: "T₁", units: "K" },
      { key: "T2", label: "T₂", units: "K" },
      { key: "dH", label: "ΔH°", units: "J/mol" },
    ],
    compute: (v, solveKey) => {
      const R = CONSTANTS.R;
      if (solveKey === "dH") return (-R * Math.log(v.K2 / v.K1)) / (1 / v.T2 - 1 / v.T1);
      if (solveKey === "K2") return v.K1 * Math.exp((-v.dH / R) * (1 / v.T2 - 1 / v.T1));
      if (solveKey === "K1") return v.K2 / Math.exp((-v.dH / R) * (1 / v.T2 - 1 / v.T1));
      if (solveKey === "T2") {
        const rhs = Math.log(v.K2 / v.K1) / (-v.dH / R);
        const invT2 = rhs + 1 / v.T1;
        if (invT2 <= 0) throw new Error("Inputs give a non-physical temperature.");
        return 1 / invT2;
      }
      const rhs = Math.log(v.K2 / v.K1) / (-v.dH / R);
      const invT1 = 1 / v.T2 - rhs;
      if (invT1 <= 0) throw new Error("Inputs give a non-physical temperature.");
      return 1 / invT1;
    },
  });
}
