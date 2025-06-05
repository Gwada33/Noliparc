import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

const TEXTS_FILE = join(process.cwd(), 'src', 'data', 'texts.json');

export interface Texts {
  header: HeaderContent;
  landing: LandingContent;
  rules: RulesContent;
  features: FeaturesContent[];
  formules: FormulesContent;
  quote: QuoteContent;
  [key: string]: string | Formula | FeaturesContent[] | HeaderContent | LandingContent | RulesContent | FormulesContent | QuoteContent;
}

export interface HeaderContent {
  "image-noli": string;
  "image-noliparc": string;
  "image-nolitexte": string;
  "image-nolijump": string;
  "image-ext": string;
  "image-nolijump-texte": string;
  brand: string;
  subtitle: string;
  cta: string;
  nav: Record<string, { label: string; link: string; button: boolean }>;
}

export interface LandingContent {
  title: string;
  description: string;
  cta: string;
}

export interface RulesContent {
  title: string;
  rules: string[];
}

export interface FeaturesContent {
  title: string;
  paragraph: string;
  link: { label: string; href: string };
  image: string;
}

export interface FormulesContent {
  title: string;
  description: string;
  cta: string;
  formules: Formula[];
}

export interface Formula {
  title: string;
  price: string;
  description: string;
  features: string[];
}

export interface QuoteContent {
  text: string;
  author: string;
  internalTitle: string;
}

export async function get_texts(): Promise<Texts> {
  try {
    const data = await readFile(TEXTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading texts:', error);
    throw new Error('Failed to load texts');
  }
}

export async function update_texts(updatedTexts: Partial<Texts>): Promise<void> {
  try {
    const currentTexts = await get_texts();
    const newTexts = { ...currentTexts, ...updatedTexts };
    await writeFile(TEXTS_FILE, JSON.stringify(newTexts, null, 2));
  } catch (error) {
    console.error('Error updating texts:', error);
    throw new Error('Failed to update texts');
  }
}

// API Route for getting texts
export async function GET() {
  try {
    const texts = await get_texts();
    return NextResponse.json(texts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load texts' }, { status: 500 });
  }
}

// API Route for updating texts
export async function PUT(request: Request) {
  try {
    const updatedTexts = await request.json();
    await update_texts(updatedTexts);
    return NextResponse.json({ message: 'Texts updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update texts' }, { status: 500 });
  }
}
