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

const byDate = (a: any, b: any) => b.data.date.valueOf() - a.data.date.valueOf();

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

export const mediaLabel = { album: 'album', movie: 'film', book: 'book' } as const;
export const shelfLabel = { album: 'Listening', movie: 'Watched', book: 'Reading' } as const;

export function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}
