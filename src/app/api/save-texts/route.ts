import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    const filePath = path.join(process.cwd(), 'public', 'texts.json')

    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur de sauvegarde :', error)
    return NextResponse.json({ success: false, error: 'Erreur lors de l\'enregistrement.' }, { status: 500 })
  }
}
