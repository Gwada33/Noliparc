import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';

export const CalendarEventSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  start: z.string(), // ISO datetime
  end: z.string().optional(), // ISO datetime
  allDay: z.boolean().default(false),
  type: z.enum(['event', 'availability', 'note']).default('event'),
});

export type CalendarEvent = z.infer<typeof CalendarEventSchema>;

export const AvailabilitySchema = z.object({
  date: z.string(), // YYYY-MM-DD
  open: z.boolean(),
  note: z.string().optional(),
});

export type Availability = z.infer<typeof AvailabilitySchema>;

type CalendarStore = {
  events: CalendarEvent[];
  availability: Record<string, Availability>; // keyed by date ISO
  updatedAt: string;
};

const storeFile = path.join(process.cwd(), 'src', 'data', 'calendar.json');

let memoryCache: { data: CalendarStore | null; ts: number } = { data: null, ts: 0 };
const TTL_MS = 10_000;

async function ensureStore(): Promise<CalendarStore> {
  const now = Date.now();
  if (memoryCache.data && now - memoryCache.ts < TTL_MS) return memoryCache.data;

  try {
    const raw = await fs.readFile(storeFile, 'utf-8');
    const parsed = JSON.parse(raw) as CalendarStore;
    memoryCache = { data: parsed, ts: now };
    return parsed;
  } catch {
    const initial: CalendarStore = { events: [], availability: {}, updatedAt: new Date().toISOString() };
    await fs.mkdir(path.dirname(storeFile), { recursive: true });
    await fs.writeFile(storeFile, JSON.stringify(initial, null, 2));
    memoryCache = { data: initial, ts: now };
    return initial;
  }
}

async function persist(store: CalendarStore) {
  store.updatedAt = new Date().toISOString();
  memoryCache = { data: store, ts: Date.now() };
  await fs.writeFile(storeFile, JSON.stringify(store, null, 2));
}

export async function listEvents(params?: { from?: string; to?: string; page?: number; pageSize?: number }) {
  const s = await ensureStore();
  let list = s.events;
  if (params?.from) list = list.filter((e) => e.start >= params.from);
  if (params?.to) list = list.filter((e) => (e.end ?? e.start) <= params.to);
  const page = Math.max(1, params?.page ?? 1);
  const pageSize = Math.max(1, Math.min(100, params?.pageSize ?? 20));
  const startIdx = (page - 1) * pageSize;
  const items = list.slice(startIdx, startIdx + pageSize);
  return { items, total: list.length, page, pageSize };
}

export async function getEvent(id: string) {
  const s = await ensureStore();
  return s.events.find((e) => e.id === id) || null;
}

export async function addEvent(event: CalendarEvent) {
  const s = await ensureStore();
  const parsed = CalendarEventSchema.parse(event);
  s.events.push(parsed);
  await persist(s);
  return parsed;
}

export async function updateEvent(id: string, patch: Partial<CalendarEvent>) {
  const s = await ensureStore();
  const idx = s.events.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  const merged = { ...s.events[idx], ...patch };
  const parsed = CalendarEventSchema.parse(merged);
  s.events[idx] = parsed;
  await persist(s);
  return parsed;
}

export async function deleteEvent(id: string) {
  const s = await ensureStore();
  const before = s.events.length;
  s.events = s.events.filter((e) => e.id !== id);
  await persist(s);
  return s.events.length < before;
}

export async function listAvailability(params?: { year?: number; month?: number }) {
  const s = await ensureStore();
  let items = Object.values(s.availability);
  if (params?.year && params?.month) {
    const prefix = `${params.year}-${String(params.month).padStart(2, '0')}`;
    items = items.filter((a) => a.date.startsWith(prefix));
  }
  return items;
}

export async function setAvailability(dateISO: string, data: Availability) {
  const s = await ensureStore();
  const parsed = AvailabilitySchema.parse(data);
  s.availability[dateISO] = parsed;
  await persist(s);
  return parsed;
}

export async function getAvailability(dateISO: string) {
  const s = await ensureStore();
  return s.availability[dateISO] || null;
}

