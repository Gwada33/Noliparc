import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { client } from '@/lib/db';

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
const TTL_MS = 0;

async function ensureStore(): Promise<CalendarStore> {
  const now = Date.now();
  if (TTL_MS > 0 && memoryCache.data && now - memoryCache.ts < TTL_MS) return memoryCache.data;

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
  const from = params?.from;
  const to = params?.to;
  if (from) list = list.filter((e) => e.start >= from);
  if (to) list = list.filter((e) => (e.end ?? e.start) <= to);
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
  const where: string[] = ['is_blocked = false'];
  const values: any[] = [];
  if (params?.year && params?.month) {
    const prefix = `${params.year}-${String(params.month).padStart(2, '0')}`;
    where.push(`to_char(date, 'YYYY-MM') = $1`);
    values.push(prefix);
  }
  const sql = `SELECT to_char(date, 'YYYY-MM-DD') AS date, TRUE AS open, COALESCE(reason, '') AS note FROM availability ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY date ASC`;
  const res = await client.query(sql, values);
  return res.rows as { date: string; open: boolean; note?: string }[];
}

export async function setAvailability(dateISO: string, data: Availability) {
  const parsed = AvailabilitySchema.parse(data);
  if (parsed.open) {
    const res = await client.query(
      `INSERT INTO availability (date, is_blocked, reason)
       VALUES ($1::date, false, $2::text)
       ON CONFLICT (date)
       DO UPDATE SET is_blocked = false, reason = EXCLUDED.reason
       RETURNING date, TRUE AS open, COALESCE(reason, '') AS note`,
      [dateISO, parsed.note ?? null]
    );
    return res.rows[0] as any;
  } else {
    await client.query(`UPDATE availability SET is_blocked = true, reason = $2 WHERE date = $1::date`, [dateISO, parsed.note ?? null]);
    return { date: dateISO, open: false, note: parsed.note } as any;
  }
}

export async function getAvailability(dateISO: string) {
  const res = await client.query(
    `SELECT to_char(date, 'YYYY-MM-DD') AS date, TRUE AS open, COALESCE(reason, '') AS note FROM availability WHERE date = $1::date AND is_blocked = false LIMIT 1`,
    [dateISO]
  );
  return res.rows[0] ?? null;
}
