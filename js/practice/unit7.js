function renderUnit7Practice(container) {
  function pHFromConcProblem() {
    const exp = randInt(2, 12);
    const mantissa = choice([1, 2, 5]);
    const H = mantissa * Math.pow(10, -exp);
    const pH = -Math.log10(H);
    return {
      text: `A solution has [H₃O⁺] = ${mantissa} × 10⁻${exp} M. What is its pH?`,
      type: "numeric",
      answer: pH,
      tolerance: 0.01,
      units: "",
      solution: `pH = −log[H₃O⁺] = −log(${mantissa}×10⁻${exp}) = ${fmtNum(pH)}`,
    };
  }

  function pOHFromPhProblem() {
    const pH = randFloat(0.5, 13.5, 2);
    const pOH = 14 - pH;
    return {
      text: `A solution has pH = ${pH}. What is its pOH?`,
      type: "numeric",
      answer: pOH,
      tolerance: 0.01,
      units: "",
      solution: `pH + pOH = 14 → pOH = 14 − ${pH} = ${fmtNum(pOH)}`,
    };
  }

  function weakAcidPhProblem() {
    const Ka = choice([1.8e-5, 6.3e-5, 1.4e-4, 3.5e-8, 6.6e-4]);
    const HA0 = randFloat(0.05, 0.5, 2);
    const x = Math.sqrt(Ka * HA0);
    const pH = -Math.log10(x);
    return {
      text: `A weak acid with K_a = ${Ka.toExponential(2)} is prepared at an initial concentration of ${HA0} M. Estimate the pH using the small-x approximation.`,
      type: "numeric",
      answer: pH,
      tolerance: 0.03,
      units: "",
      solution: `x = [H₃O⁺] ≈ √(K_a×[HA]₀) = √(${Ka.toExponential(2)}×${HA0}) = ${fmtNum(x)}\npH = −log(x) = ${fmtNum(pH)}`,
    };
  }

  function strongAcidBaseMc() {
    const strong = ["HCl", "HBr", "HI", "HNO₃", "H₂SO₄", "HClO₄", "NaOH", "KOH", "Ba(OH)₂"];
    const weak = ["CH₃COOH (acetic acid)", "HF", "NH₃", "HCN", "H₂CO₃", "HNO₂"];
    const isStrongQ = Math.random() < 0.5;
    const species = isStrongQ ? choice(strong) : choice(weak);
    const opts = shuffle([
      { text: "Strong (dissociates completely)", correct: isStrongQ },
      { text: "Weak (dissociates partially)", correct: !isStrongQ },
    ]);
    return {
      text: `Is ${species} a strong or weak acid/base?`,
      type: "mc",
      choices: opts,
      solution: `${species} is a ${isStrongQ ? "strong" : "weak"} acid/base. Memorize the short list of strong acids (HCl, HBr, HI, HNO₃, H₂SO₄, HClO₄) and strong bases (group 1/2 hydroxides) — everything else you'll encounter is weak.`,
    };
  }

  function conjugatePairMc() {
    const pairs = [
      { acid: "HF", base: "F⁻" },
      { acid: "NH₄⁺", base: "NH₃" },
      { acid: "H₂CO₃", base: "HCO₃⁻" },
      { acid: "HCO₃⁻", base: "CO₃²⁻" },
      { acid: "CH₃COOH", base: "CH₃COO⁻" },
    ];
    const p = choice(pairs);
    const distractors = shuffle(pairs.filter((x) => x !== p).map((x) => x.base)).slice(0, 3);
    const opts = shuffle([{ text: p.base, correct: true }, ...distractors.map((d) => ({ text: d, correct: false }))]);
    return {
      text: `What is the conjugate base of ${p.acid}?`,
      type: "mc",
      choices: opts,
      solution: `The conjugate base of ${p.acid} is ${p.base} — it's formed by removing one H⁺ from the acid.`,
    };
  }

  buildPractice(container, () => choice([pHFromConcProblem, pOHFromPhProblem, weakAcidPhProblem, strongAcidBaseMc, conjugatePairMc])());
}
