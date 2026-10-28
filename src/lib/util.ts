import { getCollection } from 'astro:content';

const now = new Date();

export function fmtDate(d: Date, long = false) {
  const sameYear = d.getUTCFullYear() === now.getUTCFullYear();
  return d.toLocaleDateString('en-CA', {
    month: long ? 'long' : 'short',
    day: 'numeric',
    year: long || !sameYear ? 'numeric' : undefined,
    timeZone: 'UTC',
  });
}

/** 4.5 -> { filled: "★★★★½", empty: "" } ; 4 -> { filled: "★★★★", empty: "★" } */
export function stars(r?: number) {
  if (r === undefined || r === null) return null;
  const full = Math.floor(r);
  const half = r - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return { filled: '★'.repeat(full) + (half ? '½' : ''), empty: '★'.repeat(Math.max(0, empty)) };
}

const byDate = (a: any, b: any) => (b.data.date?.valueOf() ?? 0) - (a.data.date?.valueOf() ?? 0);

export async function getNotes() {
  return (await getCollection('notes', (e) => !e.data.draft)).sort(byDate);
}
export async function getWriting() {
  return (await getCollection('writing', (e) => !e.data.draft)).sort(byDate);
}
export async function getPhotos() {
  return (await getCollection('photos')).sort(byDate);
}
export async function getMedia() {
  return (await getCollection('media')).sort(byDate);
}

export const mediaLabel = { album: 'album', movie: 'film', book: 'book', podcast: 'podcast' } as const;
export const shelfLabel = { album: 'Music', movie: 'Movies', book: 'Books', podcast: 'Podcasts' } as const;

/** Media Journal categories: one window on /media, one zoomed page each. */
export const mediaCats = [
  { type: 'album', slug: 'music', title: 'Music', blurb: 'Albums on repeat.', group: 'highlights', square: true },
  { type: 'movie', slug: 'movies', title: 'Movies', blurb: 'Everything I watch.', group: 'everything', square: false },
  { type: 'book', slug: 'books', title: 'Books', blurb: 'What I read.', group: 'everything', square: false },
  { type: 'podcast', slug: 'podcasts', title: 'Podcasts', blurb: 'Shows and episodes worth the time.', group: 'highlights', square: true },
] as const;
/** Groups of windows on /media, in display order (each window's `group` points here). */
export const mediaGroups = [
  { key: 'highlights', label: 'Not everything, just highlights' },
  { key: 'everything', label: 'Everything I can remember' },
] as const;
export const catFor = (type: string) => mediaCats.find((c) => c.type === type)!;

export function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}
