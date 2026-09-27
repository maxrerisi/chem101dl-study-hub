function renderUnit6Calculators(container) {
  // --- ICE table solver for aA + bB <=> cC + dD ---
  const iceBlock = el("div", { class: "calc-block" }, [
    el("h4", {}, ["ICE Table Solver"]),
    el("div", { class: "calc-eq" }, ["a A + b B ⇌ c C + d D,   K_c = [C]ᶜ[D]ᵈ / [A]ᵃ[B]ᶲ"]),
    el("p", { style: "font-size:12.5px;color:var(--text-dim);margin:0 0 10px;" }, [
      "Enter stoichiometric coefficients, initial concentrations, and K_c. Solves for the change x and every equilibrium concentration, assuming the reaction proceeds forward (x ≥ 0). Leave B/D coefficients at 0 if unused.",
    ]),
  ]);

  const coefRow = el("div", { class: "field-row" });
  const coefA = el("input", { type: "text", value: "1" });
  const coefB = el("input", { type: "text", value: "0" });
  const coefC = el("input", { type: "text", value: "1" });
  const coefD = el("input", { type: "text", value: "0" });
  [["a (A coeff.)", coefA], ["b (B coeff.)", coefB], ["c (C coeff.)", coefC], ["d (D coeff.)", coefD]].forEach(([label, input]) => {
    coefRow.appendChild(el("div", { class: "field" }, [el("label", {}, [label]), input]));
  });

  const concRow = el("div", { class: "field-row" });
  const A0 = el("input", { type: "text", placeholder: "e.g. 1.0" });
  const B0 = el("input", { type: "text", placeholder: "0 if unused", value: "0" });
  const C0 = el("input", { type: "text", placeholder: "0 if unused", value: "0" });
  const D0 = el("input", { type: "text", placeholder: "0 if unused", value: "0" });
  const Kc = el("input", { type: "text", placeholder: "e.g. 4.5e-3" });
  [["[A]₀", A0], ["[B]₀", B0], ["[C]₀", C0], ["[D]₀", D0], ["K_c", Kc]].forEach(([label, input]) => {
    concRow.appendChild(el("div", { class: "field" }, [el("label", {}, [label]), input]));
  });

  const iceResult = el("div", { class: "result-box" });
  const solveBtn = el("button", { class: "btn", onclick: solveIce }, ["Solve ICE table"]);

  function solveIce() {
    try {
      const a = Number(coefA.value), b = Number(coefB.value), c = Number(coefC.value), d = Number(coefD.value);
      const a0 = Number(A0.value), b0 = Number(B0.value), c0 = Number(C0.value), d0 = Number(D0.value);
      const k = Number(Kc.value);
      if ([a, b, c, d, a0, b0, c0, d0, k].some((n) => Number.isNaN(n))) throw new Error("Fill in every field with a number (use 0 where a species isn't involved).");
      if (a0 === undefined || A0.value.trim() === "") throw new Error("Enter [A]₀.");
      if (Kc.value.trim() === "") throw new Error("Enter K_c.");

      const q = (x) => {
        const A = a0 - a * x, B = b0 - b * x, C = c0 + c * x, D = d0 + d * x;
        const num = (c > 0 ? Math.pow(Math.max(C, 1e-30), c) : 1) * (d > 0 ? Math.pow(Math.max(D, 1e-30), d) : 1);
        const den = (a > 0 ? Math.pow(Math.max(A, 1e-30), a) : 1) * (b > 0 ? Math.pow(Math.max(B, 1e-30), b) : 1);
        return num / den - k;
      };

      let xMax = a > 0 ? a0 / a : Infinity;
      if (b > 0) xMax = Math.min(xMax, b0 / b);
      xMax *= 0.999999;
      let lo = 0, hi = xMax;
      let flo = q(lo), fhi = q(hi);
      if ((flo > 0 && fhi > 0) || (flo < 0 && fhi < 0)) {
        throw new Error("No forward-direction solution found in range — check your K_c and initial concentrations (reaction may run in reverse).");
      }
      let x = (lo + hi) / 2;
      for (let i = 0; i < 200; i++) {
        x = (lo + hi) / 2;
        const fx = q(x);
        if (Math.abs(fx) < 1e-12) break;
        if ((fx > 0) === (flo > 0)) { lo = x; flo = fx; } else { hi = x; }
      }

      const Aeq = a0 - a * x, Beq = b0 - b * x, Ceq = c0 + c * x, Deq = d0 + d * x;
      const lines = [`x = ${fmtNum(x)}`, `[A]eq = ${fmtNum(Aeq)}`];
      if (b > 0) lines.push(`[B]eq = ${fmtNum(Beq)}`);
      lines.push(`[C]eq = ${fmtNum(Ceq)}`);
      if (d > 0) lines.push(`[D]eq = ${fmtNum(Deq)}`);
      iceResult.classList.remove("error");
      iceResult.textContent = lines.join("   •   ");
    } catch (e) {
      iceResult.classList.add("error");
      iceResult.textContent = e.message;
    }
  }

  iceBlock.appendChild(coefRow);
  iceBlock.appendChild(concRow);
  iceBlock.appendChild(el("div", { class: "field-row" }, [solveBtn]));
  iceBlock.appendChild(iceResult);
  container.appendChild(iceBlock);

  // --- Kc <-> Kp ---
  buildSolver(container, {
    title: "K_c ↔ K_p",
    eq: "K_p = K_c (RT)^Δn,   Δn = (mol gas products) − (mol gas reactants)",
    fields: [
      { key: "Kp", label: "K_p", units: "" },
      { key: "Kc", label: "K_c", units: "" },
      { key: "dn", label: "Δn (gas mol)", units: "" },
      { key: "T", label: "T", units: "K" },
    ],
    compute: (v, solveKey) => {
      const R = CONSTANTS.R;
      if (solveKey === "Kp") return v.Kc * Math.pow(R * v.T, v.dn);
      if (solveKey === "Kc") return v.Kp / Math.pow(R * v.T, v.dn);
      if (solveKey === "dn") {
        if (v.Kc <= 0 || v.Kp <= 0) throw new Error("K values must be positive.");
        return Math.log(v.Kp / v.Kc) / Math.log(R * v.T);
      }
      if (v.dn === 0) throw new Error("Δn = 0 means K_p = K_c regardless of T — can't solve for T.");
      return Math.pow(v.Kp / v.Kc, 1 / v.dn) / R;
    },
  });
}
