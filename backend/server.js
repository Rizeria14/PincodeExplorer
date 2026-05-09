const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const NodeCache = require("node-cache");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Cache (TTL: 24 hours) ──────────────────────────────────────────────────
const cache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 });

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

// Rate limiter: 100 requests / 15 min per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please wait a few minutes." },
});
app.use("/api/", limiter);

// ─── India Post API helper ───────────────────────────────────────────────────
const INDIA_POST_API = "https://api.postalpincode.in/pincode";

async function fetchFromIndiaPost(pincode) {
  const cacheKey = `pin_${pincode}`;
  const cached = cache.get(cacheKey);
  if (cached) return { ...cached, source: "cache" };

  const response = await axios.get(`${INDIA_POST_API}/${pincode}`, {
    timeout: 8000,
  });

  const data = response.data;
  if (!Array.isArray(data) || data[0]?.Status !== "Success") {
    return null;
  }

  const postOffices = data[0].PostOffice || [];
  const result = {
    pincode,
    postOffices: postOffices.map((po) => ({
      name: po.Name,
      branchType: po.BranchType,
      deliveryStatus: po.DeliveryStatus,
      circle: po.Circle,
      district: po.District,
      division: po.Division,
      region: po.Region,
      state: po.State,
      taluk: po.Taluk,
      telephone: po.Telephone || null,
    })),
    fetchedAt: new Date().toISOString(),
  };

  cache.set(cacheKey, result);
  return { ...result, source: "api" };
}

// Curated Bangalore dataset (fallback + direct browse)
const BANGALORE_DATA = [
  { pin: "560001", area: "Bangalore GPO",          zone: "C",  landmark: "MG Road area" },
  { pin: "560002", area: "Shivajinagar",            zone: "C",  landmark: "Shivajinagar Bus Stand" },
  { pin: "560003", area: "Rajajinagar",             zone: "W",  landmark: "Rajajinagar Market" },
  { pin: "560004", area: "Malleswaram",             zone: "NW", landmark: "Sampige Road" },
  { pin: "560005", area: "Chamarajpet",             zone: "W",  landmark: "BSK Temple" },
  { pin: "560006", area: "Seshadripuram",           zone: "NW", landmark: "Seshadripuram College" },
  { pin: "560007", area: "Basavanagudi",            zone: "S",  landmark: "Bull Temple" },
  { pin: "560008", area: "Gandhinagar",             zone: "C",  landmark: "Gandhi Bazaar" },
  { pin: "560009", area: "Sadashivanagar",          zone: "N",  landmark: "Sankey Tank" },
  { pin: "560010", area: "Jayamahal",               zone: "N",  landmark: "Jayamahal Palace" },
  { pin: "560011", area: "Vijayanagar",             zone: "W",  landmark: "Vijayanagar Metro" },
  { pin: "560012", area: "Yeshwanthpur",            zone: "NW", landmark: "Yeshwanthpur Railway Station" },
  { pin: "560013", area: "RT Nagar",                zone: "N",  landmark: "RT Nagar Circle" },
  { pin: "560014", area: "Peenya",                  zone: "NW", landmark: "Peenya Industrial Area" },
  { pin: "560015", area: "Nagarbhavi",              zone: "W",  landmark: "Nagarbhavi Circle" },
  { pin: "560016", area: "Mathikere",               zone: "NW", landmark: "BEL Circle" },
  { pin: "560017", area: "Tumkur Road",             zone: "NW", landmark: "Orion Mall" },
  { pin: "560018", area: "Rajajinagar Extension",   zone: "W",  landmark: "ISRO Layout" },
  { pin: "560019", area: "Goraguntepalya",          zone: "NW", landmark: "Peenya Metro" },
  { pin: "560020", area: "Rajajinagar 2nd Block",   zone: "W",  landmark: "Chord Road" },
  { pin: "560021", area: "Subramanyanagar",         zone: "W",  landmark: "Magadi Road" },
  { pin: "560022", area: "Jayanagar",               zone: "S",  landmark: "Jayanagar 4th Block" },
  { pin: "560023", area: "BTM Layout",              zone: "S",  landmark: "Silk Board Junction" },
  { pin: "560024", area: "Lalbagh",                 zone: "S",  landmark: "Lalbagh Botanical Garden" },
  { pin: "560025", area: "Banashankari",            zone: "SW", landmark: "BSK Temple" },
  { pin: "560026", area: "JP Nagar",                zone: "SW", landmark: "JP Nagar 7th Phase" },
  { pin: "560027", area: "Bannerghatta Road",       zone: "S",  landmark: "Bannerghatta Zoo" },
  { pin: "560028", area: "Kengeri",                 zone: "SW", landmark: "Kengeri Bus Terminal" },
  { pin: "560029", area: "Yediyur",                 zone: "SW", landmark: "Uttarahalli" },
  { pin: "560030", area: "Kothanur",                zone: "SW", landmark: "Uttarahalli Road" },
  { pin: "560031", area: "Mahalakshmi Layout",      zone: "NW", landmark: "Mahalakshmi Layout Main" },
  { pin: "560032", area: "HBR Layout",              zone: "NE", landmark: "HBR Layout 5th Block" },
  { pin: "560033", area: "Byatarayanapura",         zone: "N",  landmark: "MS Ramaiah Hospital" },
  { pin: "560034", area: "Hebbal",                  zone: "N",  landmark: "Hebbal Flyover" },
  { pin: "560035", area: "Yelahanka",               zone: "N",  landmark: "Yelahanka Market" },
  { pin: "560036", area: "Devanahalli Road",        zone: "N",  landmark: "BIAL Road" },
  { pin: "560037", area: "Frazer Town",             zone: "NE", landmark: "Mosque Road" },
  { pin: "560038", area: "Banaswadi",               zone: "NE", landmark: "Banaswadi Junction" },
  { pin: "560039", area: "Lingarajapuram",          zone: "NE", landmark: "Kalyan Nagar" },
  { pin: "560040", area: "KR Puram",                zone: "E",  landmark: "KR Puram Railway Station" },
  { pin: "560041", area: "Whitefield",              zone: "E",  landmark: "Whitefield Forum Mall" },
  { pin: "560042", area: "Marathahalli",            zone: "E",  landmark: "Marathahalli Bridge" },
  { pin: "560043", area: "HAL Airport",             zone: "E",  landmark: "Old HAL Airport" },
  { pin: "560044", area: "Doddanekundi",            zone: "E",  landmark: "ITPL Road" },
  { pin: "560045", area: "Indiranagar",             zone: "E",  landmark: "100ft Road" },
  { pin: "560046", area: "Jeevan Bima Nagar",       zone: "E",  landmark: "Old Airport Road" },
  { pin: "560047", area: "Ulsoor",                  zone: "NE", landmark: "Ulsoor Lake" },
  { pin: "560048", area: "Domlur",                  zone: "E",  landmark: "Domlur Flyover" },
  { pin: "560049", area: "Koramangala",             zone: "SE", landmark: "Forum Mall" },
  { pin: "560050", area: "HSR Layout",              zone: "SE", landmark: "HSR BDA Complex" },
  { pin: "560051", area: "Electronic City",         zone: "SE", landmark: "Infosys Campus" },
  { pin: "560052", area: "Bommanahalli",            zone: "SE", landmark: "Silk Board" },
  { pin: "560053", area: "Begur",                   zone: "SE", landmark: "Begur Fort" },
  { pin: "560054", area: "Bellandur",               zone: "SE", landmark: "Sarjapur-Marathahalli Road" },
  { pin: "560055", area: "Sarjapur",                zone: "SE", landmark: "Sarjapur Road" },
  { pin: "560056", area: "Silk Board",              zone: "SE", landmark: "Silk Board Junction" },
  { pin: "560057", area: "Bommasandra",             zone: "SE", landmark: "KIADB Industrial Area" },
  { pin: "560058", area: "Hoskote",                 zone: "E",  landmark: "Hoskote Town" },
  { pin: "560059", area: "Krishnarajapuram",        zone: "E",  landmark: "KR Puram Bridge" },
  { pin: "560060", area: "Horamavu",                zone: "NE", landmark: "Horamavu Agara" },
  { pin: "560061", area: "Ramamurthy Nagar",        zone: "NE", landmark: "Ramamurthy Nagar Main" },
  { pin: "560062", area: "Kammanahalli",            zone: "NE", landmark: "Kammanahalli Circle" },
  { pin: "560063", area: "CV Raman Nagar",          zone: "E",  landmark: "HAL Layout" },
  { pin: "560064", area: "Varthur",                 zone: "E",  landmark: "Varthur Lake" },
  { pin: "560065", area: "Laggere",                 zone: "NW", landmark: "Peenya II Stage" },
  { pin: "560066", area: "Jalahalli",               zone: "NW", landmark: "Air Force Station" },
  { pin: "560067", area: "BEL Layout",              zone: "NW", landmark: "BEL Road" },
  { pin: "560068", area: "Hesaraghatta",            zone: "NW", landmark: "Hesaraghatta Cross" },
  { pin: "560069", area: "Dasarahalli",             zone: "NW", landmark: "Dasarahalli Market" },
  { pin: "560070", area: "Chikkabidarakallu",       zone: "NW", landmark: "Tumkur Road" },
  { pin: "560071", area: "Mangammanapalya",         zone: "SW", landmark: "Uttarahalli Main" },
  { pin: "560072", area: "Uttarahalli",             zone: "SW", landmark: "Uttarahalli Cross" },
  { pin: "560073", area: "Arekere",                 zone: "S",  landmark: "NICE Road" },
  { pin: "560074", area: "Gottigere",               zone: "S",  landmark: "Hulimavu Lake" },
  { pin: "560075", area: "Hongasandra",             zone: "SE", landmark: "Begur Road" },
  { pin: "560076", area: "Hulimavu",                zone: "S",  landmark: "Bannerghatta Road" },
  { pin: "560077", area: "Bannerghatta",            zone: "S",  landmark: "Bannerghatta National Park" },
  { pin: "560078", area: "Bilekahalli",             zone: "S",  landmark: "Bilekahalli Gate" },
  { pin: "560079", area: "Jigani",                  zone: "S",  landmark: "Jigani Industrial Area" },
  { pin: "560082", area: "Kodigehalli",             zone: "N",  landmark: "Sahakar Nagar" },
  { pin: "560083", area: "Bagalur",                 zone: "N",  landmark: "Near Airport" },
  { pin: "560085", area: "Thanisandra",             zone: "N",  landmark: "Manyata Tech Park" },
  { pin: "560086", area: "Kogilu",                  zone: "N",  landmark: "Yelahanka" },
  { pin: "560087", area: "Jakkur",                  zone: "N",  landmark: "Jakkur Aerodrome" },
  { pin: "560088", area: "Yelahanka New Town",      zone: "N",  landmark: "Yelahanka New Town" },
  { pin: "560089", area: "Sahakar Nagar",           zone: "N",  landmark: "Sahakara Nagar" },
  { pin: "560090", area: "Vidyaranyapura",          zone: "N",  landmark: "Vidyaranyapura Cross" },
  { pin: "560091", area: "Sanjay Nagar",            zone: "N",  landmark: "Sanjay Nagar 4th Block" },
  { pin: "560092", area: "New Thippasandra",        zone: "E",  landmark: "Old Airport Road" },
  { pin: "560093", area: "HAL 2nd Stage",           zone: "E",  landmark: "HAL Aerospace" },
  { pin: "560094", area: "Kundalahalli",            zone: "E",  landmark: "Kundalahalli Gate" },
  { pin: "560095", area: "Ramagondanahalli",        zone: "E",  landmark: "Whitefield Road" },
  { pin: "560097", area: "Brookefield",             zone: "E",  landmark: "Brookefield Mall" },
  { pin: "560098", area: "Mahadevapura",            zone: "E",  landmark: "ITPL Main Road" },
  { pin: "560099", area: "ITPL",                    zone: "E",  landmark: "International Tech Park" },
  { pin: "560100", area: "Channasandra",            zone: "E",  landmark: "Channasandra Main" },
  { pin: "560102", area: "Ganganagar",              zone: "N",  landmark: "RT Nagar Extension" },
  { pin: "560103", area: "HMT Layout",              zone: "NW", landmark: "HMT Factory" },
  { pin: "560104", area: "Nandini Layout",          zone: "NW", landmark: "Rajajinagar Extension" },
  { pin: "560105", area: "Nagasandra",              zone: "NW", landmark: "Nagasandra Metro" },
  { pin: "560107", area: "Attur Layout",            zone: "NW", landmark: "Yelahanka Road" },
  { pin: "560108", area: "Anjanapura",              zone: "SW", landmark: "Kengeri Extension" },
  { pin: "560109", area: "Electronics City Phase 2",zone: "SE", landmark: "Narayana Hrudayalaya" },
  { pin: "560110", area: "Begur Road",              zone: "SE", landmark: "Hongasandra" },
  { pin: "560111", area: "Kudlu",                   zone: "SE", landmark: "Kudlu Gate" },
  { pin: "560112", area: "Harlur",                  zone: "SE", landmark: "Harlur Road" },
  { pin: "560114", area: "Rayasandra",              zone: "SE", landmark: "Sarjapur" },
  { pin: "560300", area: "Devanahalli",             zone: "N",  landmark: "KIAL Airport" },
];

const ZONE_LABELS = {
  N: "North", S: "South", E: "East", W: "West", C: "Central",
  NE: "North East", NW: "North West", SE: "South East", SW: "South West",
};

// ─── Routes ──────────────────────────────────────────────────────────────────

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// GET /api/pincodes - list all with filters
app.get("/api/pincodes", (req, res) => {
  const { zone, search, page = 1, limit = 20, sort = "pin", order = "asc" } = req.query;

  let data = [...BANGALORE_DATA];

  if (zone && zone !== "all") {
    data = data.filter((d) => d.zone.toLowerCase() === zone.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase().trim();
    data = data.filter(
      (d) =>
        d.pin.includes(q) ||
        d.area.toLowerCase().includes(q) ||
        d.zone.toLowerCase().includes(q) ||
        d.landmark.toLowerCase().includes(q)
    );
  }

  // Sort
  const validSort = ["pin", "area", "zone"];
  const sortKey = validSort.includes(sort) ? sort : "pin";
  data.sort((a, b) =>
    order === "desc" ? b[sortKey].localeCompare(a[sortKey]) : a[sortKey].localeCompare(b[sortKey])
  );

  const total = data.length;
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const paginated = data.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  res.json({
    data: paginated.map((d) => ({ ...d, zoneLabel: ZONE_LABELS[d.zone] || d.zone })),
    meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
  });
});

// GET /api/pincode/:pin — lookup a single pincode (curated DB + India Post API)
app.get("/api/pincode/:pin", async (req, res) => {
  const { pin } = req.params;

  if (!/^\d{6}$/.test(pin)) {
    return res.status(400).json({ error: "Invalid pincode. Must be exactly 6 digits." });
  }

  // Check curated data first
  const local = BANGALORE_DATA.find((d) => d.pin === pin);

  try {
    const apiData = await fetchFromIndiaPost(pin);
    if (apiData) {
      return res.json({
        pincode: pin,
        local: local
          ? { ...local, zoneLabel: ZONE_LABELS[local.zone] || local.zone }
          : null,
        official: apiData,
      });
    }
  } catch (err) {
    console.error(`India Post API error for ${pin}:`, err.message);
  }

  // Fallback to local only
  if (local) {
    return res.json({
      pincode: pin,
      local: { ...local, zoneLabel: ZONE_LABELS[local.zone] || local.zone },
      official: null,
      note: "Live API unavailable — showing local data",
    });
  }

  res.status(404).json({ error: `No data found for pincode ${pin}` });
});

// GET /api/search/area?q=koramangala — search by area name
app.get("/api/search/area", (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) {
    return res.status(400).json({ error: "Query must be at least 2 characters." });
  }

  const query = q.toLowerCase().trim();
  const results = BANGALORE_DATA.filter(
    (d) =>
      d.area.toLowerCase().includes(query) ||
      d.landmark.toLowerCase().includes(query)
  ).map((d) => ({ ...d, zoneLabel: ZONE_LABELS[d.zone] || d.zone }));

  res.json({ query: q, results, count: results.length });
});

// GET /api/zones — list all zones with counts
app.get("/api/zones", (req, res) => {
  const counts = {};
  BANGALORE_DATA.forEach((d) => {
    counts[d.zone] = (counts[d.zone] || 0) + 1;
  });

  const zones = Object.entries(counts)
    .map(([zone, count]) => ({ zone, label: ZONE_LABELS[zone] || zone, count }))
    .sort((a, b) => a.zone.localeCompare(b.zone));

  res.json({ zones, total: BANGALORE_DATA.length });
});

// GET /api/stats — stats for the dashboard
app.get("/api/stats", (req, res) => {
  const zones = {};
  BANGALORE_DATA.forEach((d) => {
    zones[d.zone] = (zones[d.zone] || 0) + 1;
  });

  res.json({
    totalPincodes: BANGALORE_DATA.length,
    totalZones: Object.keys(zones).length,
    range: { from: "560001", to: "560300" },
    cacheSize: cache.keys().length,
    zones,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Bangalore Pincode API running on http://localhost:${PORT}`);
  console.log(`📋 Endpoints:`);
  console.log(`   GET /api/health`);
  console.log(`   GET /api/pincodes?zone=SE&search=koramangala&page=1&limit=20`);
  console.log(`   GET /api/pincode/:pin`);
  console.log(`   GET /api/search/area?q=whitefield`);
  console.log(`   GET /api/zones`);
  console.log(`   GET /api/stats\n`);
});
