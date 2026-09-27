function renderUnit7Calculators(container) {
  // --- pH / pOH / [H3O+] / [OH-] interconverter ---
  const phBlock = el("div", { class: "calc-block" }, [
    el("h4", {}, ["pH ↔ pOH ↔ [H₃O⁺] ↔ [OH⁻]"]),
    el("div", { class: "calc-eq" }, ["K_w = [H₃O⁺][OH⁻] = 1×10⁻¹⁴,   pH + pOH = 14"]),
  ]);
  const phWhich = el("select", {}, [
    el("option", { value: "pH" }, ["pH"]),
    el("option", { value: "pOH" }, ["pOH"]),
    el("option", { value: "H" }, ["[H₃O⁺] (M)"]),
    el("option", { value: "OH" }, ["[OH⁻] (M)"]),
  ]);
  const phInput = el("input", { type: "text", placeholder: "value" });
  const phResult = el("div", { class: "result-box" });
  function computePh() {
    try {
      const raw = phInput.value.trim();
      if (raw === "") throw new Error("Enter a value.");
      const x = Number(raw);
      if (Number.isNaN(x)) throw new Error("Not a valid number.");
      const which = phWhich.value;
      let pH, pOH, H, OH;
      if (which === "pH") { pH = x; pOH = 14 - pH; H = Math.pow(10, -pH); OH = Math.pow(10, -pOH); }
      else if (which === "pOH") { pOH = x; pH = 14 - pOH; H = Math.pow(10, -pH); OH = Math.pow(10, -pOH); }
      else if (which === "H") { if (x <= 0) throw new Error("[H₃O⁺] must be positive."); H = x; pH = -Math.log10(H); pOH = 14 - pH; OH = Math.pow(10, -pOH); }
      else { if (x <= 0) throw new Error("[OH⁻] must be positive."); OH = x; pOH = -Math.log10(OH); pH = 14 - pOH; H = Math.pow(10, -pH); }
      phResult.classList.remove("error");
      phResult.textContent = `pH = ${fmtNum(pH)}   •   pOH = ${fmtNum(pOH)}   •   [H₃O⁺] = ${fmtNum(H)} M   •   [OH⁻] = ${fmtNum(OH)} M`;
    } catch (e) {
      phResult.classList.add("error");
      phResult.textContent = e.message;
    }
  }
  phBlock.appendChild(el("div", { class: "field-row" }, [
    el("div", { class: "field" }, [el("label", {}, ["I know"]), phWhich]),
    el("div", { class: "field" }, [el("label", {}, ["Value"]), phInput]),
    el("button", { class: "btn", onclick: computePh }, ["Convert"]),
  ]));
  phBlock.appendChild(phResult);
  container.appendChild(phBlock);

  // --- Ka/Kb/pKa/pKb interconverter ---
  const kaBlock = el("div", { class: "calc-block" }, [
    el("h4", {}, ["K_a ↔ pK_a ↔ K_b ↔ pK_b"]),
    el("div", { class: "calc-eq" }, ["K_a × K_b = K_w = 1×10⁻¹⁴,   pK_a + pK_b = 14"]),
  ]);
  const kaWhich = el("select", {}, [
    el("option", { value: "Ka" }, ["K_a"]),
    el("option", { value: "pKa" }, ["pK_a"]),
    el("option", { value: "Kb" }, ["K_b"]),
    el("option", { value: "pKb" }, ["pK_b"]),
  ]);
  const kaInput = el("input", { type: "text", placeholder: "value" });
  const kaResult = el("div", { class: "result-box" });
  function computeKa() {
    try {
      const raw = kaInput.value.trim();
      if (raw === "") throw new Error("Enter a value.");
      const x = Number(raw);
      if (Number.isNaN(x)) throw new Error("Not a valid number.");
      const which = kaWhich.value;
      let Ka, pKa, Kb, pKb;
      if (which === "Ka") { if (x <= 0) throw new Error("K_a must be positive."); Ka = x; pKa = -Math.log10(Ka); pKb = 14 - pKa; Kb = Math.pow(10, -pKb); }
      else if (which === "pKa") { pKa = x; Ka = Math.pow(10, -pKa); pKb = 14 - pKa; Kb = Math.pow(10, -pKb); }
      else if (which === "Kb") { if (x <= 0) throw new Error("K_b must be positive."); Kb = x; pKb = -Math.log10(Kb); pKa = 14 - pKb; Ka = Math.pow(10, -pKa); }
      else { pKb = x; Kb = Math.pow(10, -pKb); pKa = 14 - pKb; Ka = Math.pow(10, -pKa); }
      kaResult.classList.remove("error");
      kaResult.textContent = `K_a = ${fmtNum(Ka)}   •   pK_a = ${fmtNum(pKa)}   •   K_b = ${fmtNum(Kb)}   •   pK_b = ${fmtNum(pKb)}`;
    } catch (e) {
      kaResult.classList.add("error");
      kaResult.textContent = e.message;
    }
  }
  kaBlock.appendChild(el("div", { class: "field-row" }, [
    el("div", { class: "field" }, [el("label", {}, ["I know"]), kaWhich]),
    el("div", { class: "field" }, [el("label", {}, ["Value"]), kaInput]),
    el("button", { class: "btn", onclick: computeKa }, ["Convert"]),
  ]));
  kaBlock.appendChild(kaResult);
  container.appendChild(kaBlock);

  // --- Percent ionization ---
  buildSolver(container, {
    title: "Percent Ionization",
    eq: "% ionization = [H₃O⁺]_eq / [HA]₀ × 100%",
    fields: [
      { key: "pct", label: "% ionization", units: "%" },
      { key: "Heq", label: "[H₃O⁺]_eq (or [A⁻]_eq)", units: "M" },
      { key: "HA0", label: "[HA]₀ (initial)", units: "M" },
    ],
    compute: (v, solveKey) => {
      if (solveKey === "pct") return (v.Heq / v.HA0) * 100;
      if (solveKey === "Heq") return (v.pct / 100) * v.HA0;
      return v.Heq / (v.pct / 100);
    },
  });

  // --- Weak acid pH from Ka (small-x approximation) ---
  buildSolver(container, {
    title: "Weak Acid pH (small-x / 5% approximation)",
    eq: "K_a ≈ x² / [HA]₀   ⇒   x = [H₃O⁺] ≈ √(K_a × [HA]₀)",
    note: "Valid when x is small relative to [HA]₀ (typically < 5% ionization). For a full ICE solve, use the general ICE Table Solver in Unit 6.",
    fields: [
      { key: "pH", label: "pH", units: "" },
      { key: "Ka", label: "K_a", units: "" },
      { key: "HA0", label: "[HA]₀", units: "M" },
    ],
    compute: (v, solveKey) => {
      if (solveKey === "pH") {
        const x = Math.sqrt(v.Ka * v.HA0);
        return -Math.log10(x);
      }
      const H = Math.pow(10, -v.pH);
      if (solveKey === "Ka") return (H * H) / v.HA0;
      return (H * H) / v.Ka;
    },
  });
}
