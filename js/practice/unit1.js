function renderUnit1Practice(container) {
  const { h, c, En_const, Rh } = CONSTANTS;

  function photonEnergyProblem() {
    const lambdaNm = randInt(200, 800);
    const lambdaM = lambdaNm * 1e-9;
    const E = (h * c) / lambdaM;
    return {
      text: `A photon has a wavelength of ${lambdaNm} nm. What is its energy (in J)?`,
      type: "numeric",
      answer: E,
      tolerance: 0.02,
      units: "J",
      solution: `E = hc/λ = (6.626×10⁻³⁴ J·s)(2.998×10⁸ m/s) / (${lambdaNm}×10⁻⁹ m)\n= ${fmtNum(E)} J`,
    };
  }

  function bohrTransitionProblem() {
    const nHigh = randInt(3, 6);
    const nLow = randInt(1, nHigh - 1);
    const Ei = -En_const * (1 / (nHigh * nHigh));
    const Ef = -En_const * (1 / (nLow * nLow));
    const dE = Ef - Ei; // emission: negative (energy released)
    return {
      text: `An electron in a hydrogen atom drops from n = ${nHigh} to n = ${nLow}. What is ΔE (in J) for this transition? (Use ΔE = E_f − E_i; a negative value means energy is released.)`,
      type: "numeric",
      answer: dE,
      tolerance: 0.02,
      units: "J",
      solution: `E_n = −2.178×10⁻¹⁸ J/n² (Z=1)\nE_i (n=${nHigh}) = ${fmtNum(Ei)} J\nE_f (n=${nLow}) = ${fmtNum(Ef)} J\nΔE = E_f − E_i = ${fmtNum(dE)} J`,
    };
  }

  function deBroglieProblem() {
    const massKg = choice([9.11e-31, 1.673e-27]); // electron or proton
    const speed = randInt(1, 9) * 1e5;
    const lambda = h / (massKg * speed);
    const particle = massKg === 9.11e-31 ? "electron" : "proton";
    return {
      text: `Find the de Broglie wavelength (in m) of ${particle === "electron" ? "an" : "a"} ${particle} moving at ${speed.toExponential(0).replace("+", "")} m/s.`,
      type: "numeric",
      answer: lambda,
      tolerance: 0.02,
      units: "m",
      solution: `λ = h/(mv) = (6.626×10⁻³⁴) / ((${massKg.toExponential(3)} kg)(${speed.toExponential(0)} m/s))\n= ${fmtNum(lambda)} m`,
    };
  }

  function trendMcProblem() {
    const pairs = [
      { text: "Na vs. Cl (same period)", answer: "Cl has the smaller atomic radius", reason: "Atomic radius decreases left → right across a period as Z_eff increases while n stays the same." },
      { text: "Li vs. Cs (same group)", answer: "Cs has the larger atomic radius", reason: "Atomic radius increases down a group as n increases." },
      { text: "O vs. F (same period)", answer: "F has the higher first ionization energy", reason: "Ionization energy generally increases left → right across a period." },
      { text: "F vs. I (same group)", answer: "F has the higher first ionization energy", reason: "Ionization energy decreases down a group as atomic radius increases and outer electrons are less tightly held." },
    ];
    const p = choice(pairs);
    const wrong = pairs.filter((x) => x !== p).map((x) => x.answer);
    const opts = shuffle([
      { text: p.answer, correct: true },
      ...shuffle(wrong).slice(0, 3).map((w) => ({ text: w, correct: false })),
    ]);
    return {
      text: `Periodic trends: for ${p.text}, which statement is correct?`,
      type: "mc",
      choices: opts,
      solution: p.reason,
    };
  }

  function quantumNumberMcProblem() {
    const n = randInt(2, 4);
    const correctL = randInt(0, n - 1);
    const wrongLs = [n, n + 1, -1].filter((x) => x !== correctL);
    const labelFor = (l) => (l < 0 ? `l = ${l} (invalid — l can't be negative)` : l >= n ? `l = ${l} (invalid — l must be < n)` : `l = ${l}`);
    const opts = shuffle([
      { text: labelFor(correctL), correct: true },
      { text: labelFor(wrongLs[0]), correct: false },
      { text: labelFor(wrongLs[1]), correct: false },
      { text: labelFor(wrongLs[2]), correct: false },
    ]);
    return {
      text: `For n = ${n}, which is a valid value of the azimuthal (angular momentum) quantum number l?`,
      type: "mc",
      choices: opts,
      solution: `l ranges from 0 to n−1. For n = ${n}, valid values are l = 0 through l = ${n - 1}.`,
    };
  }

  buildPractice(container, () => choice([photonEnergyProblem, bohrTransitionProblem, deBroglieProblem, trendMcProblem, quantumNumberMcProblem])());
}
