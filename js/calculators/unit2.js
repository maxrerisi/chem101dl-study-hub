function renderUnit2Calculators(container) {
  buildSolver(container, {
    title: "Formal Charge",
    eq: "FC = #VE − (½ × #bonding e⁻ + #lone-pair e⁻)",
    note: "#bonding e⁻ is the total electrons in that atom's bonds (2 per bond, so a double bond = 4). #lone-pair e⁻ is that atom's own nonbonding electrons.",
    fields: [
      { key: "FC", label: "Formal Charge", units: "" },
      { key: "VE", label: "Valence electrons (free atom)", units: "" },
      { key: "bonding", label: "Bonding electrons", units: "" },
      { key: "lone", label: "Lone-pair electrons", units: "" },
    ],
    compute: (v, solveKey) => {
      if (solveKey === "FC") return v.VE - (0.5 * v.bonding + v.lone);
      if (solveKey === "VE") return v.FC + 0.5 * v.bonding + v.lone;
      if (solveKey === "bonding") return 2 * (v.VE - v.FC - v.lone);
      return v.VE - v.FC - 0.5 * v.bonding;
    },
  });
}

function renderUnit3Calculators(container) {
  buildSolver(container, {
    title: "Bond Order (MO Theory)",
    eq: "Bond Order = (e⁻ in bonding MOs − e⁻ in antibonding MOs) / 2",
    fields: [
      { key: "BO", label: "Bond Order", units: "" },
      { key: "bonding", label: "e⁻ in bonding MOs", units: "" },
      { key: "antibonding", label: "e⁻ in antibonding MOs", units: "" },
    ],
    compute: (v, solveKey) => {
      if (solveKey === "BO") return (v.bonding - v.antibonding) / 2;
      if (solveKey === "bonding") return 2 * v.BO + v.antibonding;
      return v.bonding - 2 * v.BO;
    },
  });
}
