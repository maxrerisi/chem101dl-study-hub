// Shared DOM-building helpers used by calculators and practice generators.

function el(tag, attrs, children) {
  const node = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    }
  }
  (children || []).forEach((c) => {
    if (c == null) return;
    node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return node;
}

function fmtNum(x, sig = 4) {
  if (x === null || x === undefined || Number.isNaN(x)) return "—";
  if (!Number.isFinite(x)) return x > 0 ? "∞" : "-∞";
  if (x === 0) return "0";
  const abs = Math.abs(x);
  if (abs !== 0 && (abs < 1e-3 || abs >= 1e6)) {
    return x.toExponential(sig - 1).replace("e", " × 10^").replace("+", "");
  }
  const rounded = Number(x.toPrecision(sig));
  return String(rounded);
}

/**
 * Builds a "solve for any variable" calculator block.
 * opts: { title, eq, fields: [{key,label,units}], compute(values, solveKey) -> number, note }
 * compute receives an object of numeric values for every field EXCEPT solveKey,
 * and must return the solved numeric value (or throw an Error with a user-facing message).
 */
function buildSolver(container, opts) {
  const { title, eq, fields, compute, note } = opts;
  const block = el("div", { class: "calc-block" }, [
    el("h4", {}, [title]),
    el("div", { class: "calc-eq" }, [eq]),
  ]);
  if (note) block.appendChild(el("p", { style: "font-size:12.5px;color:var(--text-dim);margin:0 0 10px;" }, [note]));

  const row = el("div", { class: "field-row" });
  const solveSelect = el("select", {}, fields.map((f) => el("option", { value: f.key }, [f.label])));
  const inputs = {};

  fields.forEach((f) => {
    const input = el("input", { type: "text", placeholder: f.placeholder || "", "data-key": f.key });
    inputs[f.key] = input;
    row.appendChild(
      el("div", { class: "field" }, [
        el("label", {}, [f.label + (f.units ? ` (${f.units})` : "")]),
        input,
      ])
    );
  });

  const solveField = el("div", { class: "field solve-for" }, [
    el("label", {}, ["Solve for"]),
    solveSelect,
  ]);
  row.insertBefore(solveField, row.firstChild);

  const resultBox = el("div", { class: "result-box" });

  function refreshDisabled() {
    const solveKey = solveSelect.value;
    fields.forEach((f) => {
      inputs[f.key].disabled = f.key === solveKey;
      if (f.key === solveKey) inputs[f.key].value = "";
    });
  }
  solveSelect.addEventListener("change", refreshDisabled);
  refreshDisabled();

  const btnRow = el("div", { class: "field-row" }, [
    el("button", { class: "btn", onclick: () => runSolve() }, ["Calculate"]),
    el("button", { class: "btn secondary", onclick: () => { fields.forEach((f) => (inputs[f.key].value = "")); resultBox.textContent = ""; resultBox.classList.remove("error"); } }, ["Clear"]),
  ]);

  function runSolve() {
    const solveKey = solveSelect.value;
    const values = {};
    try {
      for (const f of fields) {
        if (f.key === solveKey) continue;
        const raw = inputs[f.key].value.trim();
        if (raw === "") throw new Error(`Enter a value for ${f.label}.`);
        const num = Number(raw);
        if (Number.isNaN(num)) throw new Error(`"${raw}" isn't a valid number for ${f.label}.`);
        values[f.key] = num;
      }
      const result = compute(values, solveKey);
      if (typeof result !== "number" || Number.isNaN(result)) throw new Error("Could not solve with those inputs.");
      const solvedField = fields.find((f) => f.key === solveKey);
      resultBox.classList.remove("error");
      resultBox.textContent = `${solvedField.label} = ${fmtNum(result)}${solvedField.units ? " " + solvedField.units : ""}`;
      inputs[solveKey].value = fmtNum(result);
    } catch (e) {
      resultBox.classList.add("error");
      resultBox.textContent = e.message || "Invalid input.";
    }
  }

  block.appendChild(row);
  block.appendChild(btnRow);
  block.appendChild(resultBox);
  container.appendChild(block);
  return block;
}

function card(title, children) {
  return el("div", { class: "card" }, [el("h3", {}, [title]), ...children]);
}

/**
 * A dynamic-row "coefficient x value, summed" tool — used for Hess's Law
 * enthalpy summing and for Σn(products) − Σm(reactants) style formulas.
 * opts: { title, eq, note, resultLabel, resultUnits }
 */
function buildWeightedSum(container, opts) {
  const { title, eq, note, resultLabel, resultUnits } = opts;
  const block = el("div", { class: "calc-block" }, [
    el("h4", {}, [title]),
    el("div", { class: "calc-eq" }, [eq]),
  ]);
  if (note) block.appendChild(el("p", { style: "font-size:12.5px;color:var(--text-dim);margin:0 0 10px;" }, [note]));

  const rowsContainer = el("div", {});
  const resultBox = el("div", { class: "result-box" });

  function addRow(coefDefault = "", valDefault = "") {
    const coefInput = el("input", { type: "text", placeholder: "coef, e.g. 2 or -1", style: "width:130px", value: coefDefault });
    const valInput = el("input", { type: "text", placeholder: "value", style: "width:130px", value: valDefault });
    const removeBtn = el("button", { class: "btn secondary", style: "padding:6px 10px;" }, ["✕"]);
    const rowEl = el("div", { class: "field-row" }, [
      el("div", { class: "field" }, [el("label", {}, ["Coefficient"]), coefInput]),
      el("div", { class: "field" }, [el("label", {}, ["Value"]), valInput]),
      removeBtn,
    ]);
    removeBtn.addEventListener("click", () => {
      rowEl.remove();
      recompute();
    });
    coefInput.addEventListener("input", recompute);
    valInput.addEventListener("input", recompute);
    rowsContainer.appendChild(rowEl);
  }

  function recompute() {
    const rows = rowsContainer.querySelectorAll(".field-row");
    let sum = 0;
    let any = false;
    let bad = false;
    rows.forEach((r) => {
      const inputs = r.querySelectorAll("input");
      const coefRaw = inputs[0].value.trim();
      const valRaw = inputs[1].value.trim();
      if (coefRaw === "" && valRaw === "") return;
      const coef = Number(coefRaw === "" ? "1" : coefRaw);
      const val = Number(valRaw);
      if (Number.isNaN(coef) || Number.isNaN(val)) { bad = true; return; }
      sum += coef * val;
      any = true;
    });
    if (bad) {
      resultBox.classList.add("error");
      resultBox.textContent = "Check for non-numeric coefficient/value entries.";
      return;
    }
    resultBox.classList.remove("error");
    resultBox.textContent = any ? `${resultLabel} = ${fmtNum(sum)}${resultUnits ? " " + resultUnits : ""}` : "";
  }

  addRow();
  addRow();

  const addBtn = el("button", { class: "btn secondary", onclick: () => addRow() }, ["+ Add term"]);

  block.appendChild(rowsContainer);
  block.appendChild(el("div", { class: "field-row" }, [addBtn]));
  block.appendChild(resultBox);
  container.appendChild(block);
  return block;
}

/**
 * Randomized practice-problem engine shared by every unit.
 * generateProblem() must return:
 *   { text, type: "numeric" | "mc", answer, tolerance?, units?, choices?, solution }
 * - numeric: answer is a number, tolerance is relative (default 0.02), units is a display string.
 * - mc: choices is [{text, correct: bool}, ...].
 * solution is a multi-line string shown on request/after answering.
 */
function buildPractice(container, generateProblem) {
  let score = { correct: 0, total: 0 };
  let current = null;
  let answered = false;

  const header = el("div", { class: "practice-header" }, [
    el("span", {}, []),
    el("span", { class: "score-pill" }, ["Score: 0 / 0"]),
  ]);
  const scorePill = header.querySelector(".score-pill");

  const qBox = el("div", { class: "question-text" });
  const answerHost = el("div", {});
  const feedback = el("div", {});
  const solutionBox = el("div", { class: "solution-box", style: "display:none;" });

  const newBtn = el("button", { class: "btn", onclick: () => nextProblem() }, ["New Problem"]);
  const solutionBtn = el("button", { class: "btn secondary", onclick: () => {
    solutionBox.style.display = solutionBox.style.display === "none" ? "block" : "none";
  } }, ["Show solution"]);

  function nextProblem() {
    current = generateProblem();
    answered = false;
    feedback.innerHTML = "";
    solutionBox.style.display = "none";
    solutionBox.textContent = current.solution || "";
    qBox.textContent = current.text;
    answerHost.innerHTML = "";

    if (current.type === "mc") {
      const optWrap = el("div", { class: "mc-options" });
      current.choices.forEach((choice) => {
        const btn = el("button", { class: "mc-option" }, [choice.text]);
        btn.addEventListener("click", () => {
          if (answered) return;
          answered = true;
          score.total++;
          if (choice.correct) score.correct++;
          optWrap.querySelectorAll(".mc-option").forEach((b, i) => {
            if (current.choices[i].correct) b.classList.add("correct");
          });
          if (!choice.correct) btn.classList.add("incorrect");
          scorePill.textContent = `Score: ${score.correct} / ${score.total}`;
          feedback.innerHTML = "";
          feedback.appendChild(el("div", { class: `feedback ${choice.correct ? "correct" : "incorrect"}` }, [
            choice.correct ? "Correct." : "Not quite.",
          ]));
        });
        optWrap.appendChild(btn);
      });
      answerHost.appendChild(optWrap);
    } else {
      const input = el("input", { type: "text", placeholder: `Answer${current.units ? " (" + current.units + ")" : ""}` });
      const checkBtn = el("button", { class: "btn", onclick: () => checkNumeric() }, ["Check"]);
      function checkNumeric() {
        if (answered) return;
        const raw = input.value.trim();
        const val = Number(raw);
        feedback.innerHTML = "";
        if (raw === "" || Number.isNaN(val)) {
          feedback.appendChild(el("div", { class: "feedback incorrect" }, ["Enter a numeric answer."]));
          return;
        }
        answered = true;
        score.total++;
        const tol = current.tolerance ?? 0.02;
        const ok = Math.abs(val - current.answer) <= Math.max(Math.abs(current.answer) * tol, 1e-9);
        if (ok) score.correct++;
        scorePill.textContent = `Score: ${score.correct} / ${score.total}`;
        feedback.appendChild(el("div", { class: `feedback ${ok ? "correct" : "incorrect"}` }, [
          ok ? "Correct." : `Not quite — expected ≈ ${fmtNum(current.answer)}${current.units ? " " + current.units : ""}.`,
        ]));
      }
      input.addEventListener("keydown", (e) => { if (e.key === "Enter") checkNumeric(); });
      answerHost.appendChild(el("div", { class: "field-row" }, [
        el("div", { class: "field" }, [el("label", {}, ["Your answer"]), input]),
        checkBtn,
      ]));
    }
  }

  const wrap = el("div", { class: "card" }, [
    header,
    qBox,
    answerHost,
    feedback,
    el("div", { class: "field-row", style: "margin-top:10px;" }, [newBtn, solutionBtn]),
    solutionBox,
  ]);
  container.appendChild(wrap);
  nextProblem();
}

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randFloat(min, max, decimals = 2) {
  const v = Math.random() * (max - min) + min;
  return Number(v.toFixed(decimals));
}
function choice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
