import places from '../data/places.json';

export const palette = ['#b79cff', '#ff9ccf', '#7fb2ff', '#7fe0c8', '#ffcf86', '#ff8f8f', '#c7f08a', '#d6a4ff'];

const countryNames: Record<string, string> = {
  ca: 'Canada', us: 'United States', mx: 'Mexico', gb: 'United Kingdom', ie: 'Ireland', fr: 'France', de: 'Germany',
  it: 'Italy', es: 'Spain', pt: 'Portugal', nl: 'Netherlands', be: 'Belgium', ch: 'Switzerland', at: 'Austria',
  gr: 'Greece', cu: 'Cuba', do: 'Dominican Republic', jm: 'Jamaica', jp: 'Japan', kr: 'South Korea', cn: 'China',
  in: 'India', au: 'Australia', nz: 'New Zealand', is: 'Iceland', dk: 'Denmark', se: 'Sweden', no: 'Norway',
  pl: 'Poland', cz: 'Czechia', hu: 'Hungary', hr: 'Croatia', tr: 'Türkiye', ma: 'Morocco', eg: 'Egypt',
  br: 'Brazil', ar: 'Argentina', pe: 'Peru', co: 'Colombia', cr: 'Costa Rica', th: 'Thailand', vn: 'Vietnam',
};
export const countryName = (c: string) => countryNames[c.toLowerCase()] ?? c.toUpperCase();

const ym = (s: string) => { const [y, m] = s.split('-').map(Number); return y * 12 + (m - 1); };
const nowYm = (() => { const d = new Date(); return d.getFullYear() * 12 + d.getMonth(); })();

export function getLived() {
  const cities: string[] = [];
  const stretches = places.lived.map((l) => {
    if (!cities.includes(l.city)) cities.push(l.city);
    const from = ym(l.from), to = l.to ? ym(l.to) : nowYm;
    return { ...l, fromYm: from, toYm: to };
  });
  const colour = (city: string) => palette[cities.indexOf(city) % palette.length];

  // one square per month, oldest first
  const start = Math.min(...stretches.map((s) => s.fromYm));
  const months: { label: string; city: string | null; colour: string | null }[] = [];
  for (let m = start; m <= nowYm; m++) {
    const s = stretches.filter((x) => m >= x.fromYm && m <= x.toYm).pop();
    const label = new Date(Math.floor(m / 12), m % 12, 1).toLocaleDateString('en-CA', { month: 'short', year: 'numeric' });
    months.push({ label, city: s?.city ?? null, colour: s ? colour(s.city) : null });
  }

  const totals = cities.map((city) => {
    const n = months.filter((x) => x.city === city).length;
    return { city, colour: colour(city), months: n, years: n / 12 };
  }).sort((a, b) => b.months - a.months);

  return { months, totals, colour, stretches };
}

export function getVisited() {
  const lived = places.lived.map((l) => ({ city: l.city, country: l.country, region: (l as any).region ?? '', lat: l.lat, lng: l.lng, lived: true }));
  const all = lived.filter((l, i) => lived.findIndex((x) => x.city === l.city) === i);
  for (const v of places.visited) if (!all.some((a) => a.city === v.city)) all.push({ ...v, lived: false });
  const byCountry = new Map<string, typeof all>();
  for (const p of all) {
    const k = p.country.toLowerCase();
    if (!byCountry.has(k)) byCountry.set(k, []);
    byCountry.get(k)!.push(p);
  }
  const countries = [...byCountry.entries()]
    .map(([code, list]) => {
      const regs = new Map<string, typeof all>();
      for (const p of list) { const r = (p as any).region || 'Other'; if (!regs.has(r)) regs.set(r, []); regs.get(r)!.push(p); }
      const regions = [...regs.entries()]
        .map(([name, ps]) => ({ name, places: ps.sort((a, b) => a.city.localeCompare(b.city)) }))
        .sort((a, b) => b.places.length - a.places.length || a.name.localeCompare(b.name));
      return { code, name: countryName(code), places: list, regions };
    })
    .sort((a, b) => b.places.length - a.places.length || a.name.localeCompare(b.name));
  return { all, countries };
}

export const flagUrl = (code: string) => `https://flagcdn.com/${code.toLowerCase()}.svg`;
export { places };
