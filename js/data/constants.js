// Physical constants & conversions, taken directly from the Chem 101 formula sheet.
const CONSTANTS = {
  c: 2.998e8,       // speed of light, m/s
  h: 6.626e-34,     // Planck's constant, J*s
  NA: 6.022e23,     // Avogadro's number, mol^-1
  me: 9.11e-31,     // electron mass, kg
  R: 8.314,         // gas constant, J/(mol*K)
  Rh: 1.097e7,      // Rydberg constant, m^-1
  En_const: 2.178e-18, // Bohr energy constant, J
  Kw: 1e-14,        // water autoionization constant at 25C
};

const CONSTANTS_TABLE = [
  { symbol: "c", name: "Speed of light", value: "2.998 × 10⁸", units: "m/s" },
  { symbol: "h", name: "Planck's constant", value: "6.626 × 10⁻³⁴", units: "J·s" },
  { symbol: "N_A", name: "Avogadro's number", value: "6.022 × 10²³", units: "mol⁻¹" },
  { symbol: "m_e", name: "Electron mass", value: "9.11 × 10⁻³¹", units: "kg" },
  { symbol: "R", name: "Gas constant", value: "8.314", units: "J/(mol·K)" },
  { symbol: "Rₕ (Rydberg)", name: "Rydberg constant", value: "1.097 × 10⁷", units: "m⁻¹" },
  { symbol: "E_n const", name: "Bohr energy constant", value: "2.178 × 10⁻¹⁸", units: "J" },
  { symbol: "K_w", name: "Water autoionization (25°C)", value: "1.0 × 10⁻¹⁴", units: "—" },
  { symbol: "C_s(water)", name: "Specific heat of water", value: "4.184", units: "J/(g·°C)" },
];

const CONVERSIONS_TABLE = [
  { rule: "1 m = 10⁹ nm" },
  { rule: "1 J = 1 kg·m²/s²" },
  { rule: "T(K) = T(°C) + 273.15" },
  { rule: "Electromagnetic spectrum (low → high energy): radiowaves – microwaves – infrared – visible – ultraviolet – x-rays – γ-rays" },
  { rule: "Common VSEPR geometries: Linear – Trigonal Planar – Bent – Tetrahedral – Trigonal Pyramidal – Trigonal Bipyramidal – Octahedral" },
];

const CATEGORY_LABELS = {
  "alkali-metal": "Alkali metal",
  "alkaline-earth": "Alkaline earth metal",
  "transition": "Transition metal",
  "post-transition": "Post-transition metal",
  "metalloid": "Metalloid",
  "nonmetal": "Nonmetal",
  "halogen": "Halogen",
  "noble-gas": "Noble gas",
  "lanthanide": "Lanthanide",
  "actinide": "Actinide",
};
