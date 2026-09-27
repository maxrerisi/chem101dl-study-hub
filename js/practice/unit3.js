function renderUnit3Practice(container) {
  function bondOrderProblem() {
    const bonding = randInt(2, 8) * 2; // even numbers
    const antibonding = randInt(0, bonding / 2) * 2;
    const bo = (bonding - antibonding) / 2;
    return {
      text: `A diatomic species has ${bonding} electrons in bonding molecular orbitals and ${antibonding} electrons in antibonding molecular orbitals. What is its bond order?`,
      type: "numeric",
      answer: bo,
      tolerance: 0.001,
      units: "",
      solution: `Bond order = (bonding e⁻ − antibonding e⁻) / 2 = (${bonding} − ${antibonding}) / 2 = ${bo}`,
    };
  }

  function hybridizationMc() {
    const cases = [
      { groups: 2, hyb: "sp" },
      { groups: 3, hyb: "sp²" },
      { groups: 4, hyb: "sp³" },
    ];
    const c = choice(cases);
    const allHyb = cases.map((x) => x.hyb);
    const opts = shuffle(allHyb.map((h) => ({ text: h, correct: h === c.hyb })));
    return {
      text: `A central atom has ${c.groups} electron groups (sigma bonds + lone pairs) around it. What is its hybridization?`,
      type: "mc",
      choices: opts,
      solution: `2 groups → sp (linear); 3 groups → sp² (trigonal planar); 4 groups → sp³ (tetrahedral).`,
    };
  }

  function paramagneticMc() {
    // Simplified homonuclear diatomic bond-order/unpaired-electron facts from MO theory
    const species = [
      { name: "O₂", unpaired: 2, mag: "paramagnetic" },
      { name: "N₂", unpaired: 0, mag: "diamagnetic" },
      { name: "B₂", unpaired: 2, mag: "paramagnetic" },
      { name: "F₂", unpaired: 0, mag: "diamagnetic" },
      { name: "C₂", unpaired: 0, mag: "diamagnetic" },
    ];
    const s = choice(species);
    const opts = shuffle([
      { text: "Paramagnetic (has unpaired electrons)", correct: s.mag === "paramagnetic" },
      { text: "Diamagnetic (all electrons paired)", correct: s.mag === "diamagnetic" },
    ]);
    return {
      text: `According to its molecular orbital diagram, is ${s.name} paramagnetic or diamagnetic?`,
      type: "mc",
      choices: opts,
      solution: `${s.name} has ${s.unpaired} unpaired electron(s) in its MO diagram, making it ${s.mag}. (O₂'s paramagnetism is a classic MO-theory result that simple Lewis structures miss.)`,
    };
  }

  buildPractice(container, () => choice([bondOrderProblem, hybridizationMc, paramagneticMc])());
}
