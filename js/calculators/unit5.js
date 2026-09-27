function renderUnit5Calculators(container) {
  buildSolver(container, {
    title: "Heat, Specific Heat Capacity & Temperature Change",
    eq: "q = m C_s ΔT",
    fields: [
      { key: "q", label: "q (heat)", units: "J" },
      { key: "m", label: "mass", units: "g" },
      { key: "Cs", label: "C_s (specific heat)", units: "J/(g·°C)" },
      { key: "dT", label: "ΔT", units: "°C" },
    ],
    compute: (v, solveKey) => {
      if (solveKey === "q") return v.m * v.Cs * v.dT;
      if (solveKey === "m") return v.q / (v.Cs * v.dT);
      if (solveKey === "Cs") return v.q / (v.m * v.dT);
      return v.q / (v.m * v.Cs);
    },
  });

  buildSolver(container, {
    title: "Heat & Heat Capacity",
    eq: "q = C ΔT",
    note: "Use this form when you have a total heat capacity (e.g. for a calorimeter) rather than a per-gram specific heat.",
    fields: [
      { key: "q", label: "q (heat)", units: "J" },
      { key: "C", label: "C (heat capacity)", units: "J/°C" },
      { key: "dT", label: "ΔT", units: "°C" },
    ],
    compute: (v, solveKey) => {
      if (solveKey === "q") return v.C * v.dT;
      if (solveKey === "C") return v.q / v.dT;
      return v.q / v.C;
    },
  });

  buildWeightedSum(container, {
    title: "Hess's Law — Enthalpy Summer",
    eq: "ΔH°_rxn = Σ (coefficient × ΔH of each step)",
    note: "Add one row per known reaction. Coefficient = the multiplier/sign you apply to that reaction to make it add up to your target reaction (e.g. 1, −1, 2, ½). Value = that reaction's ΔH (kJ or J, just be consistent).",
    resultLabel: "ΔH°_rxn",
    resultUnits: "",
  });

  buildWeightedSum(container, {
    title: "Reaction Enthalpy from ΔH°f (Products − Reactants)",
    eq: "ΔH°_rxn = ΣnΔH°_f(products) − ΣmΔH°_f(reactants)",
    note: "Enter each species once: coefficient = +(stoichiometric coeff.) for products, −(stoichiometric coeff.) for reactants. Value = its ΔH°f.",
    resultLabel: "ΔH°_rxn",
    resultUnits: "",
  });
}
