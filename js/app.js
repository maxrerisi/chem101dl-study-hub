const CALC_RENDERERS = {
  1: renderUnit1Calculators,
  2: renderUnit2Calculators,
  3: renderUnit3Calculators,
  4: renderUnit4Calculators,
  5: renderUnit5Calculators,
  6: renderUnit6Calculators,
  7: renderUnit7Calculators,
  8: renderUnit8Calculators,
};

const PRACTICE_RENDERERS = {
  1: renderUnit1Practice,
  2: renderUnit2Practice,
  3: renderUnit3Practice,
  4: renderUnit4Practice,
  5: renderUnit5Practice,
  6: renderUnit6Practice,
  7: renderUnit7Practice,
  8: renderUnit8Practice,
};

function unitById(id) {
  return UNITS.find((u) => u.id === Number(id));
}

function buildSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.innerHTML = "";
  sidebar.appendChild(el("h1", {}, ["Chem 101DL Study Hub"]));
  sidebar.appendChild(el("p", { class: "subtitle" }, ["Core Concepts in Chemistry — Fall 2026"]));

  sidebar.appendChild(el("a", { class: "nav-link", href: "#/" }, ["Home"]));
  sidebar.appendChild(el("a", { class: "nav-link", href: "#/periodic" }, ["Periodic Table & Constants"]));

  sidebar.appendChild(el("div", { class: "nav-group-label" }, ["Units"]));
  UNITS.forEach((u) => {
    sidebar.appendChild(
      el("a", { class: "nav-link", href: `#/unit/${u.id}` }, [
        el("span", { class: "unit-num" }, [String(u.id)]),
        u.title,
      ])
    );
  });
}

function setActiveNav() {
  const hash = location.hash || "#/";
  document.querySelectorAll(".nav-link").forEach((a) => {
    const href = a.getAttribute("href");
    const active =
      href === hash ||
      (href.startsWith("#/unit/") && hash.startsWith(href));
    a.classList.toggle("active", active);
  });
}

function renderHome(main) {
  main.appendChild(el("h2", { class: "view-title" }, ["Chem 101DL Study Hub"]));
  main.appendChild(el("p", { class: "view-subtitle" }, [
    "Formulas, calculators, and randomized practice for every unit of the course — built from the syllabus, learning outcomes, and exam formula sheet.",
  ]));

  const grid = el("div", { class: "home-grid" });
  UNITS.forEach((u) => {
    grid.appendChild(
      el("a", { class: "unit-card", href: `#/unit/${u.id}` }, [
        el("span", { class: "u-num" }, [`Unit ${u.id} · ${u.chapters}`]),
        el("h4", {}, [u.title]),
        el("p", {}, [`${u.formulas ? u.formulas.length : 0} formulas · reference, calculators & practice`]),
      ])
    );
  });
  main.appendChild(grid);
}

function renderUnitView(main, unitId, tab) {
  const unit = unitById(unitId);
  if (!unit) {
    main.appendChild(el("p", {}, ["Unit not found."]));
    return;
  }
  main.appendChild(el("h2", { class: "view-title" }, [`Unit ${unit.id}: ${unit.title}`]));
  main.appendChild(el("p", { class: "view-subtitle" }, [unit.chapters]));

  const tabs = ["reference", "calculators", "practice"];
  const tabLabels = { reference: "Reference", calculators: "Calculators", practice: "Practice" };
  const activeTab = tabs.includes(tab) ? tab : "reference";

  const tabBar = el("div", { class: "tabs" });
  tabs.forEach((t) => {
    const btn = el("button", { class: `tab-btn ${t === activeTab ? "active" : ""}` }, [tabLabels[t]]);
    btn.addEventListener("click", () => { location.hash = `#/unit/${unit.id}/${t}`; });
    tabBar.appendChild(btn);
  });
  main.appendChild(tabBar);

  const content = el("div", {});
  main.appendChild(content);

  if (activeTab === "reference") {
    content.appendChild(
      card("Key Concepts", [
        el("ul", { class: "concept-list" }, unit.concepts.map((c) => el("li", {}, [c]))),
      ])
    );
    if (unit.formulas && unit.formulas.length) {
      const grid = el("div", { class: "formula-grid" });
      unit.formulas.forEach((f) => {
        grid.appendChild(el("div", { class: "fname" }, [f.name]));
        grid.appendChild(el("div", { class: "feq" }, [f.eq]));
      });
      content.appendChild(card("Formula Sheet — This Unit", [grid]));
    }
  } else if (activeTab === "calculators") {
    const fn = CALC_RENDERERS[unit.id];
    if (fn) fn(content);
    else content.appendChild(el("p", {}, ["No calculators yet for this unit."]));
  } else if (activeTab === "practice") {
    const fn = PRACTICE_RENDERERS[unit.id];
    if (fn) fn(content);
    else content.appendChild(el("p", {}, ["No practice problems yet for this unit."]));
  }
}

function renderPeriodicView(main) {
  main.appendChild(el("h2", { class: "view-title" }, ["Periodic Table & Constants"]));
  main.appendChild(el("p", { class: "view-subtitle" }, ["Click an element for details. Constants and conversions below are taken directly from the exam formula sheet."]));

  const legend = el("div", { class: "legend" });
  Object.entries(CATEGORY_LABELS).forEach(([key, label]) => {
    legend.appendChild(el("span", {}, [el("span", { class: `swatch cat-${key}` }), label]));
  });
  main.appendChild(legend);

  const grid = el("div", { class: "ptable" });
  const detailBox = el("div", { class: "card element-detail" }, ["Click an element to see its details."]);

  PERIODIC_TABLE.forEach((elm) => {
    const cell = el("div", {
      class: `pcell cat-${elm.category}`,
      style: `grid-column:${elm.group}; grid-row:${elm.period};`,
    }, [
      el("div", { class: "pz" }, [String(elm.z)]),
      el("div", { class: "psym" }, [elm.symbol]),
    ]);
    cell.addEventListener("click", () => {
      detailBox.innerHTML = "";
      detailBox.appendChild(el("h3", {}, [`${elm.name} (${elm.symbol})`]));
      detailBox.appendChild(el("p", {}, [
        `Atomic number: ${elm.z}  ·  Atomic mass: ${elm.mass}  ·  Category: ${CATEGORY_LABELS[elm.category]}  ·  Period: ${elm.period <= 7 ? elm.period : elm.period === 8 ? "6 (lanthanide series)" : "7 (actinide series)"}`,
      ]));
    });
    grid.appendChild(cell);
  });

  main.appendChild(el("div", { class: "ptable-wrap" }, [grid]));
  main.appendChild(detailBox);

  const constTable = el("table", { class: "ref-table" }, [
    el("tr", {}, [el("th", {}, ["Symbol"]), el("th", {}, ["Name"]), el("th", {}, ["Value"]), el("th", {}, ["Units"])]),
    ...CONSTANTS_TABLE.map((c) => el("tr", {}, [
      el("td", {}, [c.symbol]), el("td", {}, [c.name]), el("td", {}, [c.value]), el("td", {}, [c.units]),
    ])),
  ]);
  main.appendChild(card("Physical Constants", [constTable]));

  main.appendChild(card("Conversions & General Facts", [
    el("ul", { class: "concept-list" }, CONVERSIONS_TABLE.map((c) => el("li", {}, [c.rule]))),
  ]));
}

function router() {
  const main = document.getElementById("main-content");
  main.innerHTML = "";
  const hash = location.hash || "#/";
  const parts = hash.replace(/^#\//, "").split("/").filter(Boolean);

  if (parts.length === 0) {
    renderHome(main);
  } else if (parts[0] === "periodic") {
    renderPeriodicView(main);
  } else if (parts[0] === "unit") {
    renderUnitView(main, parts[1], parts[2]);
  } else {
    renderHome(main);
  }
  setActiveNav();
  window.scrollTo(0, 0);
  const sidebar = document.getElementById("sidebar");
  if (sidebar.classList.contains("open")) sidebar.classList.remove("open");
}

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", () => {
  buildSidebar();
  router();
  const toggle = document.getElementById("mobile-nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.getElementById("sidebar").classList.toggle("open");
    });
  }
});
