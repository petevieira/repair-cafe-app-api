/**
 * Canonical product category short names. Keep in sync with
 * frontend/src/globals/ords.tsx `text` values.
 * Stored on Repair.type — never the dropdown "text (description)" label.
 */
const CANONICAL_TEXTS = [
  "E-bike component",
  "Bicycle",
  "Bicycle accessory",
  "Clock",
  "Watch",
  "Battery/charger/adapter",
  "Camera accessory",
  "Desktop computer",
  "Digital compact camera",
  "Docking station",
  "DSLR/video camera",
  "E-reader",
  "External storage",
  "GPS / Satnav",
  "Keyboard",
  "Laptop",
  "Mobile",
  "Monitor",
  "Mouse / Trackpad",
  "Network accessory",
  "Power supply unit",
  "Printer/scanner",
  "Router / Modem",
  "Tablet",
  "Tripod / Stabilizer",
  "Audio interface / mixer",
  "Audio receiver / AV receiver",
  "Bluetooth speaker",
  "CD / DVD / Blu-ray player",
  "Electronic musical accessory",
  "Flat screen TV",
  "Handheld entertainment device",
  "Headphones / Earbuds",
  "Hi-Fi integrated",
  "Hi-Fi separates",
  "Microphone",
  "Musical instrument",
  "Portable radio",
  "Projector",
  "Soundbar",
  "Turntable",
  "TV and gaming-related accessories",
  "Aircon/dehumidifier",
  "Blender / Food Processor",
  "Breadmaker",
  "Clothes dryer",
  "Clothes iron",
  "Clothes washer",
  "Coffee maker",
  "Cordless vacuum",
  "Corded vacuum",
  "Curling iron",
  "Decorative or safety lights",
  "Electric toothbrush",
  "Emergency equipment",
  "Fan / Heater",
  "Fitness electronics",
  "Hair dryer",
  "Induction cooktop",
  "Kettle",
  "Kitchen appliance (heating)",
  "Kitchen appliance (small)",
  "Lamp",
  "Large home electrical",
  "Lighting control",
  "Medical device",
  "Office equipment",
  "Paper shredder",
  "Personal health device",
  "Popcorn machine",
  "Refrigerator",
  "Rice cooker",
  "Robot vacuum",
  "Scale",
  "Security device",
  "Sewing machine",
  "Shaver",
  "Slow cooker (crock pot)",
  "Small home electrical",
  "Smart home device",
  "Straightening iron",
  "Toaster",
  "Wine cooler",
  "Chainsaw",
  "Electric scooter / mobility device",
  "Leaf blower",
  "Power drill",
  "Power tool",
  "Hand tool",
  "Clothing / textiles",
  "Furniture",
  "Animatronics",
  "Gaming console",
  "Toy",
  "Battery charger",
  "Battery pack",
  "Educational electronics",
  "Misc",
  "Payment / POS device",
  "Test & measurement equipment",
];

const CANONICAL_NAMES_WITH_PARENS = CANONICAL_TEXTS.filter((text) => text.includes(" ("));
const CANONICAL_BY_LOWER = new Map(CANONICAL_TEXTS.map((text) => [text.toLowerCase(), text]));

/**
 * Old ORDS / historical type strings → current short name.
 * Keys are lowercase canonicalized (description already stripped) values.
 */
const TYPE_ALIASES = {
  "small kitchen item": "Kitchen appliance (small)",
  vacuum: "Corded vacuum",
  fan: "Fan / Heater",
  "watch/clock": "Clock",
  "games console": "Gaming console",
  "food processor": "Blender / Food Processor",
  "flat screen": "Flat screen TV",
  headphones: "Headphones / Earbuds",
  "pc accessory": "Misc",
  "hair & beauty item": "Misc",
  iron: "Clothes iron",
};

/**
 * Map a stored Repair.type to a canonical short name.
 * @param {string} stored
 * @returns {{ canonical: string, known: boolean }}
 */
function canonicalizeProductCategory(stored) {
  const trimmed = typeof stored === "string" ? stored.trim() : "";
  if (!trimmed) {
    return { canonical: "", known: false };
  }

  // Exact canonical names that contain parentheses must not be stripped.
  const exactKnown = CANONICAL_BY_LOWER.get(trimmed.toLowerCase());
  if (exactKnown && CANONICAL_NAMES_WITH_PARENS.includes(exactKnown)) {
    return { canonical: exactKnown, known: true };
  }

  let candidate = trimmed;
  const lastSep = candidate.lastIndexOf(" (");
  if (lastSep > 0 && candidate.endsWith(")")) {
    candidate = candidate.slice(0, lastSep);
  }

  const known = CANONICAL_BY_LOWER.get(candidate.toLowerCase());
  if (known) {
    return { canonical: known, known: true };
  }

  const aliased = TYPE_ALIASES[candidate.toLowerCase()];
  if (aliased) {
    return { canonical: aliased, known: true };
  }

  return { canonical: candidate, known: false };
}

/**
 * Keywords for recategorizing Misc repairs from product / brand / model text.
 * Longer, more specific phrases should win over generic ones (see scoreHints).
 * `negative` phrases disqualify that category if they appear in the haystack.
 */
const CATEGORY_HINTS = {
  Bicycle: {
    keywords: ["bicycle", "bike", "mountain bike", "e-bike", "ebike"],
    negative: ["e-bike component", "exercise bike", "pump", "lock", "tube", "rack", "lights"],
  },
  "E-bike component": { keywords: ["e-bike battery", "ebike battery", "e-bike controller", "ebike display"] },
  "Bicycle accessory": {
    keywords: ["bicycle pump", "bike pump", "floor pump", "bike lock", "inner tube", "bike rack", "bicycle rack"],
  },
  Clock: { keywords: ["clock", "alarm clock", "wall clock"], negative: ["watch", "clock radio", "radio"] },
  Watch: { keywords: ["watch", "smartwatch", "fitness tracker", "fitbit", "garmin"] },
  "Battery/charger/adapter": {
    keywords: ["phone charger", "charger", "power adapter", "ac adapter", "laptop charger", "portable battery"],
    negative: ["battery charger", "power bank"],
  },
  "Camera accessory": { keywords: ["camera lens", "camera charger", "flash", "battery grip"] },
  "Desktop computer": { keywords: ["desktop", "tower pc", "desktop computer", "imac"] },
  "Digital compact camera": { keywords: ["digital camera", "compact camera", "point and shoot"] },
  "Docking station": { keywords: ["docking station", "laptop dock"] },
  "DSLR/video camera": { keywords: ["dslr", "video camera", "camcorder"] },
  "E-reader": { keywords: ["kindle", "kobo", "e-reader", "ereader", "nook"] },
  "External storage": { keywords: ["hard drive", "external hd", "ssd", "flash drive", "usb stick"] },
  "GPS / Satnav": { keywords: ["gps", "satnav", "garmin nuvi"] },
  Keyboard: { keywords: ["keyboard"], negative: ["piano", "synthesizer", "organ"] },
  Laptop: { keywords: ["laptop", "macbook", "chromebook", "notebook"] },
  Mobile: { keywords: ["phone", "iphone", "smartphone", "android phone", "cellphone", "cell phone"] },
  Monitor: { keywords: ["computer monitor", "pc monitor", "display monitor"], negative: ["baby monitor", "tv"] },
  "Mouse / Trackpad": { keywords: ["mouse", "trackpad", "track pad"] },
  "Network accessory": { keywords: ["network switch", "wifi extender", "access point"] },
  "Power supply unit": { keywords: ["power supply", "psu"] },
  "Printer/scanner": { keywords: ["printer", "scanner", "copier", "inkjet", "laserjet"] },
  "Router / Modem": { keywords: ["router", "modem"] },
  Tablet: { keywords: ["tablet", "ipad", "kindle fire"] },
  "Tripod / Stabilizer": { keywords: ["tripod", "gimbal", "stabilizer"] },
  "Audio interface / mixer": {
    keywords: ["audio interface", "mixing console", "audio mixer"],
    negative: ["kitchenaid", "stand mixer", "hand mixer", "blender"],
  },
  "Audio receiver / AV receiver": { keywords: ["av receiver", "receiver", "home theater"] },
  "Bluetooth speaker": { keywords: ["bluetooth speaker", "wireless speaker"] },
  "CD / DVD / Blu-ray player": { keywords: ["cd player", "dvd player", "blu-ray", "bluray"] },
  "Electronic musical accessory": { keywords: ["effects pedal", "guitar pedal", "amp pedal", "tuner pedal"] },
  "Flat screen TV": { keywords: ["tv", "television", "smart tv", "flat screen"] },
  "Handheld entertainment device": { keywords: ["ipod", "walkman", "gameboy", "psp", "nintendo ds"] },
  "Headphones / Earbuds": { keywords: ["headphones", "earbuds", "earpods", "airpods", "headset"] },
  "Hi-Fi integrated": { keywords: ["boombox", "stereo", "hi-fi", "hifi"] },
  "Hi-Fi separates": { keywords: ["amplifier", "hi-fi speaker", "hifi speaker", "bookshelf speaker"] },
  Microphone: { keywords: ["microphone", "karaoke mic"] },
  "Musical instrument": { keywords: ["electric guitar", "keyboard piano", "synthesizer", "electric piano"] },
  "Portable radio": { keywords: ["radio", "transistor radio", "radio alarm", "clock radio", "alarm clock radio"] },
  Projector: { keywords: ["projector"] },
  Soundbar: { keywords: ["soundbar", "sound bar"] },
  Turntable: { keywords: ["turntable", "record player"] },
  "TV and gaming-related accessories": { keywords: ["set-top box", "set top box", "games controller", "game controller", "xbox controller"] },
  "Aircon/dehumidifier": { keywords: ["aircon", "air conditioner", "dehumidifier", "ac unit"] },
  "Blender / Food Processor": {
    keywords: [
      "blender",
      "food processor",
      "juicer",
      "coffee grinder",
      "stick blender",
      "hand mixer",
      "stand mixer",
      "kitchenaid",
    ],
    negative: ["audio mixer", "mixing console"],
  },
  Breadmaker: { keywords: ["breadmaker", "bread machine"] },
  "Clothes dryer": { keywords: ["dryer", "tumble dryer", "clothes dryer"] },
  "Clothes iron": { keywords: ["clothes iron", "steam iron", "iron"], negative: ["curling", "straighten", "hair", "solder"] },
  "Clothes washer": { keywords: ["washing machine", "washer"] },
  "Coffee maker": { keywords: ["coffee maker", "coffee machine", "nespresso", "espresso machine", "keurig"] },
  "Cordless vacuum": { keywords: ["cordless vacuum", "stick vacuum", "dyson"] },
  "Corded vacuum": { keywords: ["corded vacuum", "vacuum", "hoover", "shop vac"], negative: ["cordless", "robot"] },
  "Curling iron": { keywords: ["curling iron", "curling wand"] },
  "Decorative or safety lights": { keywords: ["fairy lights", "christmas lights", "bike lights", "string lights"] },
  "Electric toothbrush": { keywords: ["toothbrush", "oral-b", "sonicare"] },
  "Emergency equipment": { keywords: ["flashlight", "torch", "lantern", "emergency radio"] },
  "Fan / Heater": { keywords: ["fan", "heater", "space heater", "fan heater"] },
  "Fitness electronics": { keywords: ["exercise bike", "smart trainer", "treadmill"] },
  "Hair dryer": { keywords: ["hair dryer", "hairdryer", "blow dryer"] },
  "Induction cooktop": { keywords: ["induction", "cooktop"] },
  Kettle: { keywords: ["kettle"] },
  "Kitchen appliance (heating)": { keywords: ["hot plate", "griddle", "slow cooker", "crock pot", "air fryer", "toaster oven", "microwave"] },
  "Kitchen appliance (small)": { keywords: ["milk frother", "can opener", "hand blender"] },
  Lamp: { keywords: ["lamp", "desk lamp", "floor lamp"] },
  "Large home electrical": { keywords: ["lawnmower", "lawn mower", "fitness machine"] },
  "Lighting control": { keywords: ["dimmer", "light timer", "lighting controller"] },
  "Medical device": { keywords: ["blood pressure", "thermometer", "cpap", "nebulizer"] },
  "Office equipment": { keywords: ["laminator", "label maker", "binding machine"] },
  "Paper shredder": { keywords: ["shredder"] },
  "Personal health device": { keywords: ["massage gun", "tens", "heating pad", "heated pad"] },
  "Popcorn machine": { keywords: ["popcorn"] },
  Refrigerator: { keywords: ["fridge", "refrigerator", "mini fridge"] },
  "Rice cooker": { keywords: ["rice cooker"] },
  "Robot vacuum": { keywords: ["robot vacuum", "roomba", "robovac"] },
  Scale: { keywords: ["scale", "kitchen scale"] },
  "Security device": { keywords: ["security camera", "doorbell camera", "video doorbell"] },
  "Sewing machine": { keywords: ["sewing machine"] },
  Shaver: { keywords: ["shaver", "beard trimmer", "hair clipper"], negative: ["hedge", "lawn"] },
  "Slow cooker (crock pot)": { keywords: ["slow cooker", "crock pot", "crockpot"] },
  "Small home electrical": { keywords: ["baby monitor", "doorbell", "multimeter"] },
  "Smart home device": { keywords: ["smart plug", "smart bulb", "smart thermostat", "alexa", "google home", "echo"] },
  "Straightening iron": { keywords: ["straightener", "straightening iron", "flat iron"] },
  Toaster: { keywords: ["toaster"] },
  "Wine cooler": { keywords: ["wine cooler"] },
  Chainsaw: { keywords: ["chainsaw"] },
  "Electric scooter / mobility device": { keywords: ["scooter", "e-scooter", "hoverboard", "mobility"] },
  "Leaf blower": { keywords: ["leaf blower"] },
  "Power drill": { keywords: ["drill", "cordless drill"] },
  "Power tool": { keywords: ["power tool", "circular saw", "sander", "angle grinder"] },
  "Hand tool": { keywords: ["screwdriver", "wrench", "pliers", "hammer"] },
  "Clothing / textiles": {
    keywords: [
      "clothing",
      "clothes",
      "jacket",
      "coat",
      "jeans",
      "pants",
      "shirt",
      "dress",
      "bag",
      "handbag",
      "purse",
      "backpack",
      "zipper",
      "zip",
      "hem",
      "seam",
      "fabric",
      "textile",
    ],
    negative: ["sewing machine", "vacuum", "dryer"],
  },
  Furniture: {
    keywords: [
      "furniture",
      "chair",
      "stool",
      "table",
      "desk",
      "shelf",
      "bookshelf",
      "cabinet",
      "dresser",
      "sofa",
      "couch",
      "drawer",
      "nightstand",
      "bed frame",
    ],
    negative: ["desk lamp", "lamp", "tv"],
  },
  Animatronics: { keywords: ["animatronic"] },
  "Gaming console": { keywords: ["playstation", "xbox", "nintendo switch", "game console", "games console", "ps4", "ps5"] },
  Toy: { keywords: ["toy", "rc car", "remote control car"] },
  "Battery charger": { keywords: ["battery charger", "aa charger", "aaa charger"] },
  "Battery pack": { keywords: ["power bank", "battery pack"] },
  "Educational electronics": { keywords: ["microscope", "lego mindstorms", "arduino kit"] },
  "Payment / POS device": { keywords: ["card reader", "square reader", "receipt printer", "pos"] },
  "Test & measurement equipment": { keywords: ["oscilloscope", "bench power", "signal tester"] },
};

const pad = (value) => ` ${value} `;

const normalizeHintText = (value) =>
  pad(
    String(value || "")
      .toLowerCase()
      .replace(/[^\w/+&\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );

const containsPhrase = (haystack, phrase) => haystack.includes(pad(phrase.toLowerCase()));

/**
 * Guess a category from a Misc repair's product/brand/model text.
 * Returns null when no single category wins clearly enough.
 */
function suggestProductCategory({ product = "", brand = "", model = "" } = {}) {
  const productText = normalizeHintText(product);
  const otherText = normalizeHintText(`${brand} ${model}`);
  const combined = `${productText} ${otherText}`;

  const scores = [];
  for (const [type, { keywords = [], negative = [] }] of Object.entries(CATEGORY_HINTS)) {
    if (negative.some((phrase) => containsPhrase(combined, phrase))) {
      continue;
    }
    let score = 0;
    for (const keyword of keywords) {
      const weight = keyword.split(" ").length;
      if (containsPhrase(productText, keyword)) {
        score += 4 * weight;
      } else if (containsPhrase(otherText, keyword)) {
        score += weight;
      }
    }
    if (score > 0) {
      scores.push({ type, score });
    }
  }

  scores.sort((a, b) => b.score - a.score);
  if (scores.length === 0) {
    return null;
  }

  const best = scores[0];
  const second = scores[1];
  if (best.score < 4) {
    return null;
  }
  if (second && best.score - second.score < 2) {
    return null;
  }

  return { type: best.type, score: best.score, runnerUp: second ? second.type : null };
}

module.exports = {
  CANONICAL_TEXTS,
  CANONICAL_NAMES_WITH_PARENS,
  TYPE_ALIASES,
  canonicalizeProductCategory,
  suggestProductCategory,
};
