import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';

const AdventSurpriseSchema = z.object({
  type: z.enum(['text', 'image', 'link']).default('text'),
  content: z.string().default(''),
});

export const AdventDaySchema = z.object({
  date: z.string(), // YYYY-MM-DD
  day: z.number().min(1).max(31),
  opened: z.boolean().default(false),
  surprise: AdventSurpriseSchema.default({ type: 'text', content: '' }),
});

export type AdventDay = z.infer<typeof AdventDaySchema>;

const AdventConfigSchema = z.object({
  year: z.number(),
  buttonLabel: z.string().default('Découvrir'),
});

type AdventHistoryItem = { ts: string; actor: 'admin' | 'guest'; action: string; detail?: string };

type AdventStore = {
  config: z.infer<typeof AdventConfigSchema>;
  days: Record<string, AdventDay>; // key: YYYY-MM-DD
  history: AdventHistoryItem[];
  updatedAt: string;
};

const storeFile = path.join(process.cwd(), 'src', 'data', 'advent.json');
let memoryCache: { data: AdventStore | null; ts: number } = { data: null, ts: 0 };
const TTL_MS = 10_000;

async function ensureStore(): Promise<AdventStore> {
  const now = Date.now();
  if (memoryCache.data && now - memoryCache.ts < TTL_MS) return memoryCache.data;
  try {
    const raw = await fs.readFile(storeFile, 'utf-8');
    const parsed = JSON.parse(raw) as AdventStore;
    memoryCache = { data: parsed, ts: now };
    return parsed;
  } catch {
    const year = new Date().getFullYear();
    const init: AdventStore = { config: { year, buttonLabel: 'Découvrir' }, days: {}, history: [], updatedAt: new Date().toISOString() };
    await fs.mkdir(path.dirname(storeFile), { recursive: true });
    await fs.writeFile(storeFile, JSON.stringify(init, null, 2));
    memoryCache = { data: init, ts: now };
    return init;
  }
}

async function persist(store: AdventStore) {
  store.updatedAt = new Date().toISOString();
  memoryCache = { data: store, ts: Date.now() };
  await fs.writeFile(storeFile, JSON.stringify(store, null, 2));
}

export async function listDays(year: number, month: number) {
  const s = await ensureStore();
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  return Object.values(s.days).filter((d) => d.date.startsWith(prefix));
}

export async function getDay(dateISO: string) {
  const s = await ensureStore();
  return s.days[dateISO] || null;
}

export async function setDay(dateISO: string, data: AdventDay, actor: 'admin' | 'guest') {
  const s = await ensureStore();
  const parsed = AdventDaySchema.parse(data);
  s.days[dateISO] = parsed;
  s.history.push({ ts: new Date().toISOString(), actor, action: 'setDay', detail: JSON.stringify({ dateISO }) });
  await persist(s);
  return parsed;
}

export async function openDay(dateISO: string, actor: 'admin' | 'guest') {
  const s = await ensureStore();
  const existing = s.days[dateISO] || { date: dateISO, day: Number(dateISO.split('-')[2]), opened: false, surprise: { type: 'text', content: '' } } as AdventDay;
  existing.opened = true;
  s.days[dateISO] = existing;
  s.history.push({ ts: new Date().toISOString(), actor, action: 'openDay', detail: dateISO });
  await persist(s);
  return existing;
}

export async function getConfig() {
  const s = await ensureStore();
  return s.config;
}

export async function setButtonLabel(label: string, actor: 'admin' | 'guest') {
  const s = await ensureStore();
  s.config.buttonLabel = label;
  s.history.push({ ts: new Date().toISOString(), actor, action: 'setButtonLabel', detail: label });
  await persist(s);
  return s.config;
}

export async function getHistory(page = 1, pageSize = 50) {
  const s = await ensureStore();
  const start = (page - 1) * pageSize;
  return { items: s.history.slice(start, start + pageSize), total: s.history.length };
}

