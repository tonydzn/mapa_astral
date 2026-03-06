// ============================================================
// Motor Astrológico — cálculo simplificado sem dependências nativas
// ============================================================

export interface BirthData {
    date: string;   // ISO: "1990-06-15"
    time: string;   // "14:30"
    lat: number;
    lng: number;
    place: string;
}

export interface PlanetPosition {
    planet: string;
    sign: string;
    degree: number;
    house: number;
    retrograde: boolean;
}

export interface ChartData {
    planets: PlanetPosition[];
    ascendant: { sign: string; degree: number };
    midheaven: { sign: string; degree: number };
    aspects: Aspect[];
    moonPhase: MoonPhase;
}

export interface Aspect {
    planet1: string;
    planet2: string;
    type: string;
    orb: number;
    applying: boolean;
}

export interface MoonPhase {
    name: string;
    illumination: number;
    emoji: string;
}

// ─── Constantes ─────────────────────────────────────────────

const SIGNS = [
    "Áries", "Touro", "Gêmeos", "Câncer",
    "Leão", "Virgem", "Libra", "Escorpião",
    "Sagitário", "Capricórnio", "Aquário", "Peixes",
];

const PLANETS = [
    "Sol", "Lua", "Mercúrio", "Vênus", "Marte",
    "Júpiter", "Saturno", "Urano", "Netuno", "Plutão",
];

const ASPECT_TYPES = [
    { name: "Conjunção", angle: 0, orb: 8 },
    { name: "Sextil", angle: 60, orb: 6 },
    { name: "Quadratura", angle: 90, orb: 8 },
    { name: "Trígono", angle: 120, orb: 8 },
    { name: "Oposição", angle: 180, orb: 8 },
    { name: "Quincúncio", angle: 150, orb: 3 },
];

// ─── Helpers Astronômicos ────────────────────────────────────

function toJulianDay(date: string, time: string): number {
    const [y, m, d] = date.split("-").map(Number);
    const [h, min] = time.split(":").map(Number);
    const ut = h + min / 60;
    const A = Math.floor((14 - m) / 12);
    const yy = y + 4800 - A;
    const mm = m + 12 * A - 3;
    const JDN =
        d +
        Math.floor((153 * mm + 2) / 5) +
        365 * yy +
        Math.floor(yy / 4) -
        Math.floor(yy / 100) +
        Math.floor(yy / 400) -
        32045;
    return JDN + ut / 24;
}

function sunLongitude(jd: number): number {
    const n = jd - 2451545.0;
    const L = (280.46 + 0.9856474 * n) % 360;
    const g = ((357.528 + 0.9856003 * n) * Math.PI) / 180;
    const lambda = L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g);
    return ((lambda % 360) + 360) % 360;
}

function moonLongitude(jd: number): number {
    const n = jd - 2451545.0;
    const L = (218.316 + 13.176396 * n) % 360;
    const M = ((134.963 + 13.064993 * n) * Math.PI) / 180;
    const F = ((93.272 + 13.22935 * n) * Math.PI) / 180;
    const lambda = L + 6.289 * Math.sin(M) - 1.274 * Math.sin(2 * F - M);
    return ((lambda % 360) + 360) % 360;
}

function planetLongitude(planet: string, jd: number): number {
    const n = jd - 2451545.0;
    const base: Record<string, number> = {
        Sol: sunLongitude(jd),
        Lua: moonLongitude(jd),
        "Mercúrio": (252.25 + 4.0923 * n) % 360,
        "Vênus": (181.98 + 1.6021 * n) % 360,
        Marte: (355.43 + 0.5240 * n) % 360,
        "Júpiter": (34.40 + 0.0831 * n) % 360,
        Saturno: (50.08 + 0.0335 * n) % 360,
        Urano: (314.0 + 0.0117 * n) % 360,
        Netuno: (304.35 + 0.006 * n) % 360,
        "Plutão": (238.95 + 0.004 * n) % 360,
    };
    const lon = ((base[planet] ?? 0) % 360 + 360) % 360;
    return lon;
}

function degreesToSign(lon: number): { sign: string; degree: number } {
    const signIndex = Math.floor(lon / 30);
    const degree = lon % 30;
    return { sign: SIGNS[signIndex] ?? SIGNS[0], degree: Math.round(degree * 10) / 10 };
}

function ascendantLongitude(jd: number, lat: number, lng: number): number {
    const GMST = (280.46061837 + 360.98564736629 * (jd - 2451545.0)) % 360;
    const LST = ((GMST + lng) % 360 + 360) % 360;
    const obliquity = (23.439 * Math.PI) / 180;
    const latRad = (lat * Math.PI) / 180;
    const lstRad = (LST * Math.PI) / 180;
    const ascRad = Math.atan2(
        Math.cos(lstRad),
        -(Math.sin(lstRad) * Math.cos(obliquity) + Math.tan(latRad) * Math.sin(obliquity))
    );
    return ((ascRad * 180) / Math.PI + 360) % 360;
}

function calculateHouse(planetLon: number, ascLon: number): number {
    const diff = ((planetLon - ascLon + 360) % 360);
    return Math.floor(diff / 30) + 1;
}

function getMoonPhase(jd: number): MoonPhase {
    const sunLon = sunLongitude(jd);
    const moonLon = moonLongitude(jd);
    const phase = ((moonLon - sunLon + 360) % 360);
    const illumination = (1 - Math.cos((phase * Math.PI) / 180)) / 2;

    const phases: MoonPhase[] = [
        { name: "Lua Nova", illumination, emoji: "🌑" },
        { name: "Lua Crescente", illumination, emoji: "🌒" },
        { name: "Quarto Crescente", illumination, emoji: "🌓" },
        { name: "Lua Crescente Gibosa", illumination, emoji: "🌔" },
        { name: "Lua Cheia", illumination, emoji: "🌕" },
        { name: "Lua Minguante Gibosa", illumination, emoji: "🌖" },
        { name: "Quarto Minguante", illumination, emoji: "🌗" },
        { name: "Lua Minguante", illumination, emoji: "🌘" },
    ];

    const idx = Math.floor((phase / 360) * 8) % 8;
    return phases[idx];
}

function findAspects(positions: Record<string, number>): Aspect[] {
    const aspects: Aspect[] = [];
    const planetNames = Object.keys(positions);

    for (let i = 0; i < planetNames.length; i++) {
        for (let j = i + 1; j < planetNames.length; j++) {
            const p1 = planetNames[i];
            const p2 = planetNames[j];
            const diff = Math.abs(positions[p1] - positions[p2]);
            const angle = diff > 180 ? 360 - diff : diff;

            for (const aspectType of ASPECT_TYPES) {
                const orb = Math.abs(angle - aspectType.angle);
                if (orb <= aspectType.orb) {
                    aspects.push({
                        planet1: p1,
                        planet2: p2,
                        type: aspectType.name,
                        orb: Math.round(orb * 10) / 10,
                        applying: positions[p1] < positions[p2],
                    });
                }
            }
        }
    }
    return aspects;
}

// ─── Exportação Principal ────────────────────────────────────

export function calculateChart(data: BirthData): ChartData {
    const jd = toJulianDay(data.date, data.time);
    const ascLon = ascendantLongitude(jd, data.lat, data.lng);
    const mcLon = (ascLon + 270) % 360;

    const rawPositions: Record<string, number> = {};
    PLANETS.forEach((p) => {
        rawPositions[p] = planetLongitude(p, jd);
    });

    const planets: PlanetPosition[] = PLANETS.map((planet) => {
        const lon = rawPositions[planet];
        const { sign, degree } = degreesToSign(lon);
        const house = calculateHouse(lon, ascLon);
        const retrograde =
            ["Saturno", "Urano", "Netuno", "Plutão"].includes(planet) &&
            (lon % 120) > 60;

        return { planet, sign, degree, house, retrograde };
    });

    return {
        planets,
        ascendant: degreesToSign(ascLon),
        midheaven: degreesToSign(mcLon),
        aspects: findAspects(rawPositions).slice(0, 15),
        moonPhase: getMoonPhase(jd),
    };
}

export function currentMoonPhase(): MoonPhase {
    const now = new Date();
    const jd = toJulianDay(
        now.toISOString().split("T")[0],
        `${now.getHours()}:${now.getMinutes()}`
    );
    return getMoonPhase(jd);
}
