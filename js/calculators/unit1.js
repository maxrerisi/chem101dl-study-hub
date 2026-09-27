function renderUnit1Calculators(container) {
  const { h, c, En_const, Rh } = CONSTANTS;

  buildSolver(container, {
    title: "Frequency ↔ Wavelength",
    eq: "c = νλ",
    fields: [
      { key: "nu", label: "Frequency ν", units: "Hz (1/s)" },
      { key: "lambda", label: "Wavelength λ", units: "m" },
    ],
    compute: (v, solveKey) => (solveKey === "nu" ? c / v.lambda : c / v.nu),
  });

  buildSolver(container, {
    title: "Photon Energy",
    eq: "E = hν = hc/λ",
    note: "Enter wavelength in meters (e.g. 500 nm = 5e-7 m).",
    fields: [
      { key: "E", label: "Photon Energy", units: "J" },
      { key: "lambda", label: "Wavelength λ", units: "m" },
    ],
    compute: (v, solveKey) => (solveKey === "E" ? (h * c) / v.lambda : (h * c) / v.E),
  });

  buildSolver(container, {
    title: "Bohr Orbital Energy",
    eq: "E_n = −2.178×10⁻¹⁸ J × (Z²/n²)",
    note: "Z = atomic number (1 for H, 2 for He⁺, etc.), n = principal quantum number.",
    fields: [
      { key: "En", label: "E_n", units: "J" },
      { key: "Z", label: "Z", units: "" },
      { key: "n", label: "n", units: "" },
    ],
    compute: (v, solveKey) => {
      if (solveKey === "En") return -En_const * (v.Z * v.Z) / (v.n * v.n);
      if (solveKey === "Z") {
        const z2 = (-v.En * v.n * v.n) / En_const;
        if (z2 < 0) throw new Error("E_n must be negative for a bound electron.");
        return Math.sqrt(z2);
      }
      const n2 = (-En_const * v.Z * v.Z) / v.En;
      if (n2 < 0) throw new Error("E_n must be negative for a bound electron.");
      return Math.sqrt(n2);
    },
  });

  buildSolver(container, {
    title: "Transition Energy",
    eq: "ΔE = E_f − E_i",
    fields: [
      { key: "dE", label: "ΔE", units: "J" },
      { key: "Ei", label: "E_i (initial)", units: "J" },
      { key: "Ef", label: "E_f (final)", units: "J" },
    ],
    compute: (v, solveKey) => {
      if (solveKey === "dE") return v.Ef - v.Ei;
      if (solveKey === "Ei") return v.Ef - v.dE;
      return v.Ei + v.dE;
    },
  });

  buildSolver(container, {
    title: "Rydberg Equation (line spectra)",
    eq: "1/λ = 1.097×10⁷ m⁻¹ × Z² (1/n_low² − 1/n_high²)",
    note: "n_low is the lower energy level, n_high the higher one (n_high > n_low). λ is the magnitude of the transition wavelength.",
    fields: [
      { key: "lambda", label: "Wavelength λ", units: "m" },
      { key: "Z", label: "Z", units: "" },
      { key: "nlow", label: "n_low", units: "" },
      { key: "nhigh", label: "n_high", units: "" },
    ],
    compute: (v, solveKey) => {
      if (solveKey === "lambda") {
        const invLambda = Rh * v.Z * v.Z * (1 / (v.nlow * v.nlow) - 1 / (v.nhigh * v.nhigh));
        if (invLambda <= 0) throw new Error("n_high must be greater than n_low.");
        return 1 / invLambda;
      }
      if (solveKey === "Z") {
        const term = 1 / (v.nlow * v.nlow) - 1 / (v.nhigh * v.nhigh);
        const z2 = 1 / (v.lambda * Rh * term);
        if (z2 < 0) throw new Error("Check n_low/n_high — n_high must exceed n_low.");
        return Math.sqrt(z2);
      }
      if (solveKey === "nlow") {
        const rhs = 1 / (v.lambda * Rh * v.Z * v.Z) + 1 / (v.nhigh * v.nhigh);
        if (rhs <= 0) throw new Error("Inputs give no valid n_low.");
        return 1 / Math.sqrt(rhs);
      }
      const rhs = 1 / (v.nlow * v.nlow) - 1 / (v.lambda * Rh * v.Z * v.Z);
      if (rhs <= 0) throw new Error("Inputs give no valid n_high.");
      return 1 / Math.sqrt(rhs);
    },
  });

  buildSolver(container, {
    title: "de Broglie Wavelength",
    eq: "λ_d = h / (m v)",
    fields: [
      { key: "lambda", label: "λ_d", units: "m" },
      { key: "m", label: "mass", units: "kg" },
      { key: "v", label: "velocity", units: "m/s" },
    ],
    compute: (v, solveKey) => {
      if (solveKey === "lambda") return h / (v.m * v.v);
      if (solveKey === "m") return h / (v.lambda * v.v);
      return h / (v.lambda * v.m);
    },
  });

  buildSolver(container, {
    title: "Photoelectric Effect",
    eq: "hν = Φ + KE,  KE = ½ m v²",
    note: "Φ is the work function (minimum energy to eject an electron).",
    fields: [
      { key: "nu", label: "Frequency ν", units: "Hz" },
      { key: "phi", label: "Work function Φ", units: "J" },
      { key: "KE", label: "Ejected e⁻ KE", units: "J" },
    ],
    compute: (v, solveKey) => {
      if (solveKey === "nu") return (v.phi + v.KE) / h;
      if (solveKey === "phi") return h * v.nu - v.KE;
      const ke = h * v.nu - v.phi;
      if (ke < 0) throw new Error("ν is below the threshold frequency — no electron is ejected.");
      return ke;
    },
  });
}
