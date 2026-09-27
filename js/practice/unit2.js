function renderUnit2Practice(container) {
  function formalChargeProblem() {
    const VE = choice([4, 5, 6, 7]);
    const bonds = choice([1, 2, 3, 4]); // number of bonds (bonding pairs)
    const bondingE = bonds * 2;
    const maxLone = Math.max(0, Math.floor((8 - bondingE) / 2));
    const lonePairs = randInt(0, maxLone);
    const loneE = lonePairs * 2;
    const FC = VE - (0.5 * bondingE + loneE);
    return {
      text: `An atom has ${VE} valence electrons, forms ${bonds} bond${bonds > 1 ? "s" : ""} (${bondingE} bonding electrons total), and has ${lonePairs} lone pair${lonePairs === 1 ? "" : "s"} (${loneE} nonbonding electrons). What is its formal charge?`,
      type: "numeric",
      answer: FC,
      tolerance: 0.001,
      units: "",
      solution: `FC = VE − (½×bonding e⁻ + lone-pair e⁻) = ${VE} − (½×${bondingE} + ${loneE}) = ${FC}`,
    };
  }

  function bondPolarityMc() {
    const pairs = [
      { a: "C", b: "F", type: "polar covalent" },
      { a: "Na", b: "Cl", type: "ionic" },
      { a: "C", b: "H", type: "nonpolar (essentially) covalent" },
      { a: "O", b: "O", type: "nonpolar covalent" },
      { a: "K", b: "Br", type: "ionic" },
      { a: "N", b: "H", type: "polar covalent" },
    ];
    const p = choice(pairs);
    const options = ["ionic", "polar covalent", "nonpolar (essentially) covalent", "nonpolar covalent"];
    const opts = shuffle(options.filter((o, i, arr) => arr.indexOf(o) === i).map((o) => ({ text: o, correct: o === p.type })));
    return {
      text: `Based on electronegativity difference, what type of bond forms between ${p.a} and ${p.b}?`,
      type: "mc",
      choices: opts,
      solution: `Large electronegativity gap (typically a metal + nonmetal) → ionic. Moderate gap between nonmetals → polar covalent. Same/near-same element → nonpolar covalent.`,
    };
  }

  function vseprMc() {
    const geoms = [
      { groups: 2, lone: 0, name: "Linear" },
      { groups: 3, lone: 0, name: "Trigonal Planar" },
      { groups: 3, lone: 1, name: "Bent" },
      { groups: 4, lone: 0, name: "Tetrahedral" },
      { groups: 4, lone: 1, name: "Trigonal Pyramidal" },
      { groups: 4, lone: 2, name: "Bent" },
      { groups: 5, lone: 0, name: "Trigonal Bipyramidal" },
      { groups: 6, lone: 0, name: "Octahedral" },
    ];
    const g = choice(geoms);
    const allNames = [...new Set(geoms.map((x) => x.name))];
    const wrongNames = shuffle(allNames.filter((n) => n !== g.name)).slice(0, 3);
    const opts = shuffle([{ text: g.name, correct: true }, ...wrongNames.map((n) => ({ text: n, correct: false }))]);
    return {
      text: `A central atom has ${g.groups} electron group${g.groups > 1 ? "s" : ""} around it (bonds + lone pairs), of which ${g.lone} ${g.lone === 1 ? "is a lone pair" : "are lone pairs"}. What is the molecular geometry?`,
      type: "mc",
      choices: opts,
      solution: `${g.groups} electron groups with ${g.lone} lone pair(s) gives ${g.name} molecular geometry (VSEPR).`,
    };
  }

  buildPractice(container, () => choice([formalChargeProblem, bondPolarityMc, vseprMc])());
}
