function renderUnit4Calculators(container) {
  // --- Integrated rate law (order-dependent) ---
  const orderBlock = el("div", { class: "calc-block" }, [
    el("h4", {}, ["Integrated Rate Law"]),
    el("div", { class: "calc-eq" }, ["Zero: [A]=−kt+[A]₀  |  First: ln[A]=−kt+ln[A]₀  |  Second: 1/[A]=kt+1/[A]₀"]),
  ]);
  const orderSelect = el("select", {}, [
    el("option", { value: "0" }, ["Zero-order"]),
    el("option", { value: "1" }, ["First-order"]),
    el("option", { value: "2" }, ["Second-order"]),
  ]);
  const fieldsHost = el("div", {});
  orderBlock.appendChild(el("div", { class: "field-row" }, [
    el("div", { class: "field" }, [el("label", {}, ["Reaction order"]), orderSelect]),
  ]));
  orderBlock.appendChild(fieldsHost);

  function rebuildOrderSolver() {
    fieldsHost.innerHTML = "";
    const order = orderSelect.value;
    const fields = [
      { key: "A0", label: "[A]₀ (initial conc.)", units: "M" },
      { key: "At", label: "[A]_t (conc. at time t)", units: "M" },
      { key: "k", label: "k (rate constant)", units: order === "0" ? "M/s" : order === "1" ? "1/s" : "1/(M·s)" },
      { key: "t", label: "t (time)", units: "s" },
    ];
    buildSolver(fieldsHost, {
      title: `${order === "0" ? "Zero" : order === "1" ? "First" : "Second"}-order solver`,
      eq:
        order === "0" ? "[A]_t = −kt + [A]₀" :
        order === "1" ? "ln[A]_t = −kt + ln[A]₀" :
        "1/[A]_t = kt + 1/[A]₀",
      fields,
      compute: (v, solveKey) => {
        if (order === "0") {
          if (solveKey === "At") return v.A0 - v.k * v.t;
          if (solveKey === "A0") return v.At + v.k * v.t;
          if (solveKey === "k") return (v.A0 - v.At) / v.t;
          return (v.A0 - v.At) / v.k;
        }
        if (order === "1") {
          if (v.A0 !== undefined && v.A0 <= 0) throw new Error("[A]₀ must be positive.");
          if (v.At !== undefined && v.At <= 0) throw new Error("[A]_t must be positive.");
          if (solveKey === "At") return Math.exp(Math.log(v.A0) - v.k * v.t);
          if (solveKey === "A0") return Math.exp(Math.log(v.At) + v.k * v.t);
          if (solveKey === "k") return (Math.log(v.A0) - Math.log(v.At)) / v.t;
          return (Math.log(v.A0) - Math.log(v.At)) / v.k;
        }
        // second order
        if (solveKey === "At") {
          const inv = v.k * v.t + 1 / v.A0;
          if (inv <= 0) throw new Error("Inputs give a non-physical (negative) concentration.");
          return 1 / inv;
        }
        if (solveKey === "A0") {
          const inv = 1 / v.At - v.k * v.t;
          if (inv <= 0) throw new Error("Inputs give a non-physical (negative) concentration.");
          return 1 / inv;
        }
        if (solveKey === "k") return (1 / v.At - 1 / v.A0) / v.t;
        return (1 / v.At - 1 / v.A0) / v.k;
      },
    });
  }
  orderSelect.addEventListener("change", rebuildOrderSolver);
  rebuildOrderSolver();
  container.appendChild(orderBlock);

  // --- Half-life ---
  const hlBlock = el("div", { class: "calc-block" }, [
    el("h4", {}, ["Half-Life"]),
    el("div", { class: "calc-eq" }, ["Zero: t½=[A]₀/2k  |  First: t½=0.693/k  |  Second: t½=1/(k[A]₀)"]),
  ]);
  const hlOrderSelect = el("select", {}, [
    el("option", { value: "0" }, ["Zero-order"]),
    el("option", { value: "1" }, ["First-order"]),
    el("option", { value: "2" }, ["Second-order"]),
  ]);
  const hlFieldsHost = el("div", {});
  hlBlock.appendChild(el("div", { class: "field-row" }, [
    el("div", { class: "field" }, [el("label", {}, ["Reaction order"]), hlOrderSelect]),
  ]));
  hlBlock.appendChild(hlFieldsHost);

  function rebuildHalfLife() {
    hlFieldsHost.innerHTML = "";
    const order = hlOrderSelect.value;
    if (order === "1") {
      buildSolver(hlFieldsHost, {
        title: "First-order half-life",
        eq: "t½ = 0.693 / k",
        fields: [
          { key: "t12", label: "t½", units: "s" },
          { key: "k", label: "k", units: "1/s" },
        ],
        compute: (v, solveKey) => (solveKey === "t12" ? 0.693 / v.k : 0.693 / v.t12),
      });
    } else if (order === "0") {
      buildSolver(hlFieldsHost, {
        title: "Zero-order half-life",
        eq: "t½ = [A]₀ / (2k)",
        fields: [
          { key: "t12", label: "t½", units: "s" },
          { key: "A0", label: "[A]₀", units: "M" },
          { key: "k", label: "k", units: "M/s" },
        ],
        compute: (v, solveKey) => {
          if (solveKey === "t12") return v.A0 / (2 * v.k);
          if (solveKey === "A0") return 2 * v.k * v.t12;
          return v.A0 / (2 * v.t12);
        },
      });
    } else {
      buildSolver(hlFieldsHost, {
        title: "Second-order half-life",
        eq: "t½ = 1 / (k[A]₀)",
        fields: [
          { key: "t12", label: "t½", units: "s" },
          { key: "A0", label: "[A]₀", units: "M" },
          { key: "k", label: "k", units: "1/(M·s)" },
        ],
        compute: (v, solveKey) => {
          if (solveKey === "t12") return 1 / (v.k * v.A0);
          if (solveKey === "A0") return 1 / (v.k * v.t12);
          return 1 / (v.A0 * v.t12);
        },
      });
    }
  }
  hlOrderSelect.addEventListener("change", rebuildHalfLife);
  rebuildHalfLife();
  container.appendChild(hlBlock);

  // --- Arrhenius equation ---
  buildSolver(container, {
    title: "Arrhenius Equation",
    eq: "k = A e^(−Ea/RT)",
    note: "Ea in J/mol, T in Kelvin.",
    fields: [
      { key: "k", label: "k", units: "" },
      { key: "A", label: "A (pre-exponential)", units: "" },
      { key: "Ea", label: "Ea", units: "J/mol" },
      { key: "T", label: "T", units: "K" },
    ],
    compute: (v, solveKey) => {
      const R = CONSTANTS.R;
      if (solveKey === "k") return v.A * Math.exp(-v.Ea / (R * v.T));
      if (solveKey === "A") return v.k / Math.exp(-v.Ea / (R * v.T));
      if (solveKey === "Ea") return -R * v.T * Math.log(v.k / v.A);
      return -v.Ea / (R * Math.log(v.k / v.A));
    },
  });

  buildSolver(container, {
    title: "Arrhenius — Two Temperatures",
    eq: "ln(k₁/k₂) = (Ea/R)(1/T₂ − 1/T₁)",
    note: "Solve for Ea, or for one rate constant/temperature given the rest.",
    fields: [
      { key: "k1", label: "k₁ (at T₁)", units: "" },
      { key: "k2", label: "k₂ (at T₂)", units: "" },
      { key: "T1", label: "T₁", units: "K" },
      { key: "T2", label: "T₂", units: "K" },
      { key: "Ea", label: "Ea", units: "J/mol" },
    ],
    compute: (v, solveKey) => {
      const R = CONSTANTS.R;
      if (solveKey === "Ea") return (R * Math.log(v.k1 / v.k2)) / (1 / v.T2 - 1 / v.T1);
      if (solveKey === "k1") return v.k2 * Math.exp((v.Ea / R) * (1 / v.T2 - 1 / v.T1));
      if (solveKey === "k2") return v.k1 / Math.exp((v.Ea / R) * (1 / v.T2 - 1 / v.T1));
      if (solveKey === "T1") {
        const rhs = Math.log(v.k1 / v.k2) / (v.Ea / R) ;
        // rhs = 1/T2 - 1/T1  => 1/T1 = 1/T2 - rhs
        const invT1 = 1 / v.T2 - rhs;
        if (invT1 <= 0) throw new Error("Inputs give a non-physical temperature.");
        return 1 / invT1;
      }
      const rhs = Math.log(v.k1 / v.k2) / (v.Ea / R);
      const invT2 = rhs + 1 / v.T1;
      if (invT2 <= 0) throw new Error("Inputs give a non-physical temperature.");
      return 1 / invT2;
    },
  });
}
